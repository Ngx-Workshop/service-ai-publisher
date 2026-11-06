#!/usr/bin/env python3
"""Promote a validated CI image; never print or rewrite production credentials."""
import hashlib
import os
from pathlib import Path
import re
import subprocess
import sys
import time

NAME = 'service-ai-publisher'
ENV = Path('/etc/ngx-workshop/ai-publisher/runtime.env')
VOLUME = 'ngx-publisher-runs'


def docker(*args):
    return subprocess.check_output(['docker', *args], text=True, stderr=subprocess.PIPE).strip()


def deploy(directory, revision, release):
    if not re.fullmatch(r'[0-9a-f]{40}', revision) or not re.fullmatch(r'\d+-\d+', release):
        raise RuntimeError('Invalid release identity')
    archive = directory / 'image.tar'
    checksum = (directory / 'image.tar.sha256').read_text().split()[0]
    with archive.open('rb') as stream:
        digest = hashlib.sha256()
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    if digest.hexdigest() != checksum:
        raise RuntimeError('Image archive checksum mismatch')
    expected = (directory / 'image-id.txt').read_text().strip()
    if not re.fullmatch(r'sha256:[0-9a-f]{64}', expected):
        raise RuntimeError('Invalid image identity')
    if ENV.stat().st_uid != 0 or ENV.stat().st_mode & 0o077:
        raise RuntimeError('Missing or insecure host-owned runtime configuration')
    # Read only for validation; do not print values or transfer this file into CI.
    config = dict(line.split('=', 1) for line in ENV.read_text().splitlines()
                  if line and not line.startswith('#') and '=' in line)
    required = {'PORT': '3014', 'NODE_ENV': 'production',
                'PUBLISHING_ENABLED': 'true',
                'PUBLISHING_JOURNAL_DIRECTORY': '/var/lib/ngx-publishing'}
    if any(config.get(key) != value for key, value in required.items()):
        raise RuntimeError('Runtime configuration does not match production deployment')
    docker('network', 'inspect', 'ngx-net')
    docker('volume', 'inspect', VOLUME)
    # Prevent legacy gateway and publisher from writing the same receipt journal.
    writers = docker('ps', '--filter', f'volume={VOLUME}', '--format', '{{.Names}}').splitlines()
    if any(writer != NAME for writer in writers):
        raise RuntimeError('Drain and detach the legacy publishing writer before deployment')
    docker('load', '--input', str(archive))
    actual = docker('image', 'inspect', 'service-ai-publisher:candidate', '--format', '{{.Id}}')
    label = docker('image', 'inspect', expected, '--format',
                   '{{index .Config.Labels "org.opencontainers.image.revision"}}')
    if actual != expected or label != revision:
        raise RuntimeError('Loaded image does not match the validated commit')
    image = f'{NAME}:ci-{release}'
    docker('image', 'tag', expected, image)
    # Runtime configuration, network and receipt volume must be prepared before bootstrap.
    exists = bool(docker('ps', '-a', '--filter', f'name=^{NAME}$', '--format', '{{.Names}}'))
    previous = f'{NAME}.before-ci-{release}'
    if exists:
        docker('stop', NAME)
        try:
            docker('rename', NAME, previous)
        except Exception:
            docker('start', NAME)
            raise
    try:
        docker('run', '-d', '--name', NAME, '--env-file', str(ENV),
               '--network', 'ngx-net', '--restart', 'unless-stopped',
               '--user', '1000:1000', '--read-only',
               '--tmpfs', '/tmp:size=16m,noexec,nosuid', '--cap-drop', 'ALL',
               '--security-opt', 'no-new-privileges:true',
               '--mount', f'type=volume,source={VOLUME},target=/var/lib/ngx-publishing', image)
        for attempt in range(30):
            try:
                status = docker('exec', NAME, 'node', '-e',
                                "fetch('http://127.0.0.1:3014/publisher/tools', {method:'POST'})"
                                ".then(r=>process.stdout.write(String(r.status))).catch(()=>process.exit(1))")
                if status == '401':
                    print(f'Deployed {revision}; rollback container: {previous}')
                    return
            except (subprocess.CalledProcessError, ValueError):
                pass
            time.sleep(2)
        raise RuntimeError('Publisher failed protected-endpoint readiness check')
    except Exception:
        # docker run can fail after creating the container; remove it if present.
        try:
            docker('container', 'inspect', NAME)
        except subprocess.CalledProcessError:
            pass
        else:
            docker('rm', '-f', NAME)
        if exists:
            docker('rename', previous, NAME)
            docker('start', NAME)
        raise RuntimeError('Deployment failed; previous container restored if present') from None


if __name__ == '__main__':
    try:
        os.umask(0o077)
        deploy(Path.cwd(), sys.argv[1], sys.argv[2])
    except RuntimeError as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
    except Exception:
        # Docker error output/inspect data can contain environment secrets.
        print('Publisher deployment failed; inspect the private host state before retrying.', file=sys.stderr)
        sys.exit(1)
    finally:
        for filename in ('image.tar', 'image.tar.sha256', 'image-id.txt'):
            Path(filename).unlink(missing_ok=True)

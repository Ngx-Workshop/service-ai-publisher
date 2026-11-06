#!/usr/bin/env python3
"""Promote a validated CI image; never print or rewrite production credentials."""
import hashlib
import os
from pathlib import Path
import re
import stat
import subprocess
import sys
import time

NAME = 'service-ai-publisher'
ENV = Path('/etc/ngx-workshop/ai-publisher/runtime.env')
VOLUME = 'ngx-publisher-runs'
LEGACY_ENV = Path('/etc/ngx-workshop/oauth/gateway/runtime.env')
OWNER_SETTINGS = ('DOCUMENT_BASE_URL', 'CODING_LABS_BASE_URL', 'ASSESSMENT_BASE_URL',
                  'UPLOADER_BASE_URL', 'AUTH_BASE_URL')
MODEL_SETTINGS = ('OPENAI_API_KEY', 'PUBLISHING_MODEL', 'PUBLISHING_MODELS_JSON',
                  'PUBLISHING_IMAGE_MODEL')


def read_runtime(path):
    try:
        info = path.lstat()
    except FileNotFoundError:
        raise RuntimeError(f'Missing private runtime configuration: {path}') from None
    if not stat.S_ISREG(info.st_mode) or info.st_uid != 0 or info.st_mode & 0o077:
        raise RuntimeError(f'Runtime configuration must be a root-owned private regular file: {path}')
    return dict(line.split('=', 1) for line in path.read_text().splitlines()
                if line and not line.startswith('#') and '=' in line)


def ensure_runtime():
    # Existing operator-owned settings are never replaced or merged.
    if ENV.exists() or ENV.is_symlink():
        read_runtime(ENV)
        return False
    config = read_runtime(LEGACY_ENV)
    missing = [name for name in OWNER_SETTINGS if not config.get(name)]
    if missing:
        raise RuntimeError('Legacy runtime is missing required publisher settings: ' + ', '.join(missing))
    values = {'PORT': '3014', 'NODE_ENV': 'production', 'PUBLISHING_ENABLED': 'true',
              'PUBLISHING_JOURNAL_DIRECTORY': '/var/lib/ngx-publishing'}
    values.update((name, config[name]) for name in (*OWNER_SETTINGS, *MODEL_SETTINGS) if name in config)
    if any('\r' in value or '\0' in value for value in values.values()):
        raise RuntimeError('Legacy publisher settings contain invalid characters')
    ENV.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    descriptor = os.open(ENV, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(descriptor, 'w') as output:
            output.write(''.join(f'{name}={value}\n' for name, value in values.items()))
            output.flush()
            os.fsync(output.fileno())
    except Exception:
        ENV.unlink()
        raise
    return True



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
    ensure_runtime()
    config = read_runtime(ENV)
    required = {'PORT': '3014', 'NODE_ENV': 'production',
                'PUBLISHING_ENABLED': 'true',
                'PUBLISHING_JOURNAL_DIRECTORY': '/var/lib/ngx-publishing'}
    if any(config.get(key) != value for key, value in required.items()):
        raise RuntimeError('Runtime configuration does not match production deployment')
    for args, message in [
        (('network', 'inspect', 'ngx-net'), 'Missing or inaccessible Docker network ngx-net'),
        (('volume', 'inspect', VOLUME), 'Missing or inaccessible existing publishing receipt volume'),
    ]:
        try:
            docker(*args)
        except subprocess.CalledProcessError:
            raise RuntimeError(message) from None
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
        if sys.argv[1:] == ['--prepare-runtime']:
            created = ensure_runtime()
            print('Publisher private runtime prepared' if created else 'Publisher private runtime already present; preserved')
        else:
            deploy(Path.cwd(), sys.argv[1], sys.argv[2])
    except RuntimeError as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
    except Exception:
        # Docker error output/inspect data can contain environment secrets.
        print('Publisher deployment failed; inspect the private host state before retrying.', file=sys.stderr)
        sys.exit(1)
    finally:
        for filename in (() if sys.argv[1:] == ['--prepare-runtime'] else ('image.tar', 'image.tar.sha256', 'image-id.txt')):
            Path(filename).unlink(missing_ok=True)

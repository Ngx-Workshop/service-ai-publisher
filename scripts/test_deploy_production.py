"""Failure-path tests without Docker or production access."""
import hashlib
import importlib.util
from pathlib import Path
import subprocess
import tempfile
import stat
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('deployment', Path(__file__).with_name('deploy-production.py'))
deployment = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deployment)
REVISION = 'a' * 40
IMAGE = 'sha256:' + 'b' * 64


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'image.tar').write_bytes(b'validated image')
        (self.root / 'image.tar.sha256').write_text(hashlib.sha256(b'validated image').hexdigest() + '  image.tar\n')
        (self.root / 'image-id.txt').write_text(IMAGE)
        self.env = self.root / 'runtime.env'
        self.env.write_text('PORT=3014\nNODE_ENV=production\nPUBLISHING_ENABLED=true\nPUBLISHING_JOURNAL_DIRECTORY=/var/lib/ngx-publishing\nOPENAI_API_KEY=private-test-value\n')
        self.env.chmod(0o600)
        self.calls = []
        self.ready = True
        self.fail_run = False
        self.bad_image = False

    def docker(self, *args):
        self.calls.append(args)
        if args[:2] == ('image', 'inspect'):
            return ('sha256:' + 'c' * 64 if self.bad_image else IMAGE) if args[2].endswith(':candidate') else REVISION
        if args[0] == 'run' and self.fail_run:
            raise subprocess.CalledProcessError(1, args)
        if args[0] == 'exec':
            if not self.ready:
                raise subprocess.CalledProcessError(1, args)
            return '401'
        if args[0] == 'ps' and '-a' in args:
            return deployment.NAME
        return ''

    def deploy(self):
        actual_lstat = Path.lstat
        def root_runtime(path):
            info = actual_lstat(path)
            if path == self.env:
                return type('Stat', (), {'st_uid': 0, 'st_mode': info.st_mode})()
            return info
        with patch.object(deployment, 'ENV', self.env), \
             patch.object(deployment, 'docker', self.docker), patch.object(deployment.time, 'sleep'), \
             patch.object(Path, 'lstat', root_runtime):
            deployment.deploy(self.root, REVISION, '123-1')

    def test_success_preserves_runtime_and_volume(self):
        before = self.env.read_bytes()
        self.deploy()
        self.assertEqual(self.env.read_bytes(), before)
        run = next(args for args in self.calls if args[0] == 'run')
        self.assertIn('type=volume,source=ngx-publisher-runs,target=/var/lib/ngx-publishing', run)
        self.assertIn('--read-only', run)
        self.assertNotIn('-p', run)
        self.assertNotIn('private-test-value', str(self.calls))
        self.assertNotIn(('start', deployment.NAME), self.calls)

    def test_legacy_writer_prevents_deploy(self):
        original = self.docker
        def with_writer(*args):
            if args[0] == 'ps' and '-a' not in args:
                return 'service-mcp-gateway'
            return original(*args)
        with patch.object(self, 'docker', with_writer):
            with self.assertRaisesRegex(RuntimeError, 'legacy publishing writer'):
                self.deploy()
        self.assertNotIn(('stop', deployment.NAME), self.calls)

    def test_checksum_rejected_before_docker(self):
        (self.root / 'image.tar').write_bytes(b'corrupt')
        with self.assertRaisesRegex(RuntimeError, 'checksum'):
            self.deploy()
        self.assertEqual(self.calls, [])

    def test_wrong_image_rejected_before_stopping(self):
        self.bad_image = True
        with self.assertRaisesRegex(RuntimeError, 'validated commit'):
            self.deploy()
        self.assertNotIn(('stop', deployment.NAME), self.calls)

    def test_readiness_failure_restores_previous(self):
        self.ready = False
        with self.assertRaisesRegex(RuntimeError, 'previous container restored'):
            self.deploy()
        self.assertEqual(self.calls[-3:], [('rm', '-f', deployment.NAME), ('rename', deployment.NAME + '.before-ci-123-1', deployment.NAME), ('start', deployment.NAME)])

    def test_run_failure_restores_previous(self):
        self.fail_run = True
        with self.assertRaisesRegex(RuntimeError, 'previous container restored'):
            self.deploy()
        self.assertEqual(self.calls[-1], ('start', deployment.NAME))


class RuntimePreparationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.target = self.root / 'publisher' / 'runtime.env'
        self.legacy = self.root / 'legacy.env'
        self.legacy.write_text(''.join(f'{name}=http://owner.invalid\n' for name in deployment.OWNER_SETTINGS)
                               + 'OPENAI_API_KEY=private-provider-value\nAUTH_INTROSPECTION_CLIENT_SECRET=must-not-copy\n'
                               + 'MONGODB_URI=must-not-copy\nPORT=3011\nNODE_ENV=development\n')
        self.legacy.chmod(0o600)

    def prepare(self):
        actual_lstat = Path.lstat
        def root_runtime(path):
            info = actual_lstat(path)
            return type('Stat', (), {'st_uid': 0, 'st_mode': info.st_mode})()
        with patch.object(deployment, 'ENV', self.target), patch.object(deployment, 'LEGACY_ENV', self.legacy), \
             patch.object(Path, 'lstat', root_runtime):
            return deployment.ensure_runtime()

    def test_copies_only_publisher_settings_and_preserves_legacy(self):
        before = self.legacy.read_bytes()
        self.assertTrue(self.prepare())
        settings = self.target.read_text()
        self.assertIn('OPENAI_API_KEY=private-provider-value\n', settings)
        self.assertIn('PORT=3014\n', settings)
        self.assertIn('NODE_ENV=production\n', settings)
        self.assertNotIn('must-not-copy', settings)
        self.assertEqual(stat.S_IMODE(self.target.stat().st_mode), 0o600)
        self.assertEqual(self.legacy.read_bytes(), before)

    def test_existing_private_runtime_is_never_overwritten(self):
        self.prepare()
        self.target.write_text('operator=preserved\n')
        self.assertFalse(self.prepare())
        self.assertEqual(self.target.read_text(), 'operator=preserved\n')

    def test_missing_legacy_reports_path_without_creating_runtime(self):
        self.legacy.unlink()
        with self.assertRaisesRegex(RuntimeError, 'Missing private runtime configuration'):
            self.prepare()
        self.assertFalse(self.target.exists())

    def test_insecure_source_is_rejected(self):
        self.legacy.chmod(0o644)
        with self.assertRaisesRegex(RuntimeError, 'root-owned private regular file'):
            self.prepare()
        self.assertFalse(self.target.exists())

    def test_incomplete_source_is_rejected_without_exposing_values(self):
        self.legacy.write_text('OPENAI_API_KEY=private-provider-value\n')
        with self.assertRaisesRegex(RuntimeError, 'missing required publisher settings') as error:
            self.prepare()
        self.assertNotIn('private-provider-value', str(error.exception))
        self.assertFalse(self.target.exists())

    def test_symlink_target_is_rejected(self):
        self.target.parent.mkdir()
        self.target.symlink_to(self.legacy)
        with self.assertRaisesRegex(RuntimeError, 'private regular file'):
            self.prepare()


if __name__ == '__main__':
    unittest.main()

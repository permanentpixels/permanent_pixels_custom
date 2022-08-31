import unittest


import scratch

class TestScratch(unittest.TestCase):
    def setUp(self):
        scratch.DB_NAME = 'testdb.sqlite'

    def tearDown(self):
        pass

    def test_persist(self):
        scratch.store('name', 'hello')

        self.assertEqual('hello', scratch.load('name'))

        scratch.store('hello', None)

        self.assertEqual(None, scratch.load('hello'))



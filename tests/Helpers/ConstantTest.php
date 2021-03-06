<?php

namespace Tests\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Constant;
use Tests\TestCase;

class ConstantTest extends TestCase
{
	public function getProvider()
	{
		return [
			'when the value is set in the environment' => [[
				'args' => [
					'key' => 'UPLOADS_FOLDER',
				],
				'expected' => 'assets',
			]],
			'when the value is not set in the environment but has a default' => [[
				'args' => [
					'key' => 'THUMBNAILS_FOLDER',
				],
				'expected' => 'thumbnails',
			]],
			'when the value is not set in the environment and has no default' => [[
				'args' => [
					'key' => 'FOO',
				],
				'expected' => null,
			]],
		];
	}

	/**
	 * @dataProvider getProvider
	 */
	public function testGet($args)
	{
		$output = Constant::get(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function verifyProvider()
	{
		return [
			'when the value is set in the environment' => [[
				'args' => [
					'key' => 'UPLOADS_FOLDER',
				],
			]],
			'when the value is not set in the environment' => [[
				'args' => [
					'key' => 'THUMBNAILS_FOLDER',
				],
				'expectedMessage' => 'Environment variable "THUMBNAILS_FOLDER" is not set.',
			]],
		];
	}

	/**
	 * @dataProvider verifyProvider
	 */
	public function testVerify($args)
	{
		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}
		$output = Constant::verify(...array_values($args['args']));
	}
}

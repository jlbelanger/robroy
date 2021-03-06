<?php

namespace Jlbelanger\Robroy\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Constant;

class File
{
	/**
	 * Deletes a file from the file system.
	 *
	 * @param  string $filename
	 * @return void
	 */
	public static function delete(string $filename)
	{
		$path = Constant::get('UPLOADS_PATH') . '/' . $filename;
		if (!file_exists($path)) {
			throw new ApiException('File "' . $filename . '" does not exist.');
		}
		if (!unlink($path)) {
			throw new ApiException('File "' . $filename . '" could not be deleted.', 500);
		}
	}
}

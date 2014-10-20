<?php

class Course extends Controller
{
	/**
	 * Returns information about a particular course.
	 */
	public function get($course_id)
	{
		$stmt = $this->db->prepare("SELECT * FROM `courses` WHERE `courseid` = ? LIMIT 1;");
		$result = $stmt->execute($course_id);

		if(len($result) == 0)
			return 404;

		$this->response->json($result->row);
	}
}
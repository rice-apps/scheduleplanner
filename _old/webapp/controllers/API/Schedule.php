<?php

class Schedule extends Controller
{
	/**
	 * Returns a json list of the courses in the active user's schedule.
	 */
	public function all($year)
	{
		$stmt = $this->db->prepare("SELECT * FROM `schedules` WHERE `userid` = ? AND `year` = ?;");
		$result = $stmt->execute($this->auth->user->id, $year);

		$courses = array();

		foreach($result as $row) {
			$courses[] = (int) $row['courseid'];
		}

		$this->response->json($courses);
	}

	/**
	 * Add a course to the active user's schedule.
	 */
	public function add($year)
	{
		$stmt = $this->db->prepare("INSERT INTO `schedules` (`userid`, `courseid`, `year`) VALUES (?, ?, ?);");
		$stmt->execute($this->auth->user->id, $this->request->post['courseid'], $year);
		return 200;
	}

	/**
	 * Deletes a course from the active user's schedule.
	 */
	public function delete($year)
	{
		$stmt = $this->db->prepare("DELETE FROM `schedules` WHERE `userid` = ? AND `year` = ? AND `courseid` = ?;");
		$stmt->execute($this->auth->user->id, $year, $this->request->post['courseid']);
		return 200;
	}
}
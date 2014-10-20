<?php

class Playground extends Controller
{
	/**
	 * Returns a json list of the courses in the active user's playground.
	 */
	public function all()
	{
		$stmt = $this->db->prepare("SELECT * FROM `playgrounds` WHERE `userid` = ?;");
		$result = $stmt->execute($this->auth->user->id);

		$courses = array();

		foreach($result as $row) {
			$courses[] = (int) $row['courseid'];
		}

		$this->response->json($courses);
	}

	/**
	 * Add a course to the active user's playground.
	 */
	public function add()
	{
		$stmt = $this->db->prepare("INSERT INTO `playgrounds` (`userid`, `courseid`) VALUES (?, ?);");
		$stmt->execute($this->auth->user->id, $this->request->post['courseid']);
		return 200;
	}

	/**
	 * Deletes a course from the active user's playground.
	 */
	public function delete()
	{
		$stmt = $this->db->prepare("DELETE FROM `playgrounds` WHERE `userid` = ? AND `courseid` = ?;");
		$stmt->execute($this->auth->user->id, $this->request->post['courseid']);
		return 200;
	}
}
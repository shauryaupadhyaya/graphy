extends Panel


# diff float values:
# easy: 1x
# medium: 1.5x
# hard: 2x
func _load_scores(pipe_score: int, q_score: int, diff: float):
	print(pipe_score, q_score, diff)

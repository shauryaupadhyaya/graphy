extends Node

@export var score: int = 0

func _increment_score(value) -> void:
	score += value

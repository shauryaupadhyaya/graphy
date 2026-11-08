extends Node

var score: int = 0
@export var player_alive: bool = true
var questions_score: float = 0
# diff float values:
# easy: 1x, easy questions 1 point
# medium: 1.5x, medium questions 2 points
# hard: 2x, hard questions 4 points

var difficulty: float = 1.0
var total_score: float = 0.0

func _increment_score(value) -> void:
	score += value

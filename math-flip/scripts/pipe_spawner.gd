extends Node2D

@export var pipe_scene: PackedScene
@onready var timer: Timer = $"../Timer"
@export var spawn: bool = true
@onready var score_counter: Label = $"../Control/ScoreCounter"
@onready var player: CharacterBody2D = $"../Player"

func _ready() -> void:
	timer.connect("timeout", _spawn_pipe)

func _spawn_pipe() -> void:
	timer.wait_time = 1.3
	if spawn:
		var pipe = pipe_scene.instantiate()
		pipe.game_started = true
		add_child(pipe)
		pipe.position = Vector2(922, randf_range(150, 450))
	timer.start()

func _update_score() -> void:
	score_counter.text = str(Manager.score)

func _player_die() -> void: 
	player._show_score_menu()
	var children = self.get_children(true)
	for child in children:
		child._stop_moving()

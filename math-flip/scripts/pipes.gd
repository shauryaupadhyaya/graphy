extends Node2D

@onready var pipe_bottom: Area2D = $PipeBottom
@onready var pipe_top: Area2D = $PipeTop
@export var speed: float = 200.0
var game_started: bool = false

func _ready() -> void:
	game_started = get_parent().spawn
	pipe_bottom.connect("body_entered", _kill_player)
	pipe_top.connect("body_entered", _kill_player)

func _process(delta: float) -> void:
	if game_started:
		position.x -= (speed * delta)

func _on_point_rewards_area_body_entered(_body: Node2D) -> void:
	print("PIPE REWARD")
	Manager._increment_score(1)
	get_parent()._update_score()

func _kill_player(_body: Node2D) -> void:
	Manager.player_alive = false
	get_parent()._player_die()

func _stop_moving() -> void:
	game_started = false
	set_process(false)

func _start_moving() -> void:
	game_started = true
	set_process(true)

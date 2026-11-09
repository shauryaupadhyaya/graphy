extends CharacterBody2D

@onready var sky: Parallax2D = $"../Sky"
@onready var clouds_back: Parallax2D = $"../Clouds_Back"
@onready var clouds_front: Parallax2D = $"../Clouds_Front"

@onready var player: CharacterBody2D = $"."
@onready var score_menu: Panel = $"../Control/OuterPanel-Pause"
@onready var spawner: Node2D = $"../Spawner"

@onready var score_counter: Label = $"../Control/ScoreCounter"

@onready var bird: AnimatedSprite2D = $Bird
@onready var collision_shape_2d: CollisionShape2D = $CollisionShape2D

@export var gravity: float = 900
@export var jump_force: float = -350
@export var is_paused: bool = true
func _input(event: InputEvent) -> void:
	motion_mode = CharacterBody2D.MOTION_MODE_FLOATING
	if not is_paused:
		if event.is_action_pressed("space"):
			self.rotation_degrees = -20
			pass
	

func _physics_process(delta: float) -> void:
	if not is_paused:
		velocity.y += delta * gravity
		if Input.is_action_just_pressed("space") or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
			velocity.y = jump_force
		if velocity.y > 0:
			self.rotation = lerp_angle(self.rotation, deg_to_rad(90), delta * 2)
		else:
			self.rotation = lerp_angle(self.rotation, deg_to_rad(-90), delta * 2)
		move_and_slide()


func _on_world_border_body_entered(body: Node2D) -> void:
	if body.get_instance_id() == self.get_instance_id() :
		print("touched kill zone")
		_show_score_menu()
		spawner._player_die()


func _show_score_menu() -> void:
	sky.autoscroll = Vector2(0, 1)
	clouds_back.autoscroll = Vector2(1, 1)
	clouds_front.autoscroll = Vector2(1, 1)
	spawner.spawn = false
	is_paused = true
	score_menu.show()
	bird.pause()
	score_menu._load_scores()

func _hide_score_menu() -> void:
	sky.autoscroll = Vector2(-20, 1)
	clouds_back.autoscroll = Vector2(-50, 1)
	clouds_front.autoscroll = Vector2(-70, 1)
	bird.play("flap")
	spawner.spawn = true
	is_paused = false
	score_menu.hide()


#func _on_pipe_bottom_body_entered(body: Node2D) -> void:
	#if body.get_instance_id() == self.get_instance_id():
		#_show_score_menu()
#
#
#
#func _on_pipe_top_body_entered(body: Node2D) -> void:
	#if body.get_instance_id() == self.get_instance_id():
		#_show_score_menu()
#
#func _on_point_rewards_area_body_entered(body: Node2D) -> void:
	#if body.get_instance_id() == self.get_instance_id():
		#Manager._increment_score(1)
		#score_counter.text = str(Manager.score)
		#print(Manager.score)

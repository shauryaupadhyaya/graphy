extends CharacterBody2D

@onready var bird: AnimatedSprite2D = $Bird
@onready var collision_shape_2d: CollisionShape2D = $CollisionShape2D
# todo: make bird turn up when keyboard press
@export var gravity: float = 900
@export var jump_force: float = -350
@export var is_paused: bool = true
func _input(event: InputEvent) -> void:
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
		get_tree().paused = true

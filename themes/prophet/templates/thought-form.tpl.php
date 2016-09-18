<?php

	# Modify Markup
	$form['thought']["#title_display"] = "invisible";
	$form['thought']['#attributes']['placeholder'] = array("Speak the truth...");
	
	# Modify Classes
	$form['state']['#attributes']['class'] = array("btn-primary");
	$form['predict']['#attributes']['class'] = array("btn-predict");
	$form['ask']['#attributes']['class'] = array("btn-success");
	$form['reflect']['#attributes']['class'] = array("btn-reflect");
	print drupal_render_children($form);
	
?>
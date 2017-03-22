<?php

/**
 * @file
 * template.php
 */

/**
  * Implements hook_theme().
  */
  
function prophet_theme() {
  return array( 'thought_form' => array(
    'render element' => 'form',
    'path' => drupal_get_path('theme', 'prophet') . '/templates',
    'template' => 'thought-form',
    ),
  );
}

/**
  * Implements template_preprocess_views_view().
  */

function prophet_preprocess_views_view(&$vars) {

  $view = &$vars['view'];

  if ($view->name == 'Bubble_Stream') {
    drupal_add_js("https://d3js.org/d3.v4.min.js", 'external');
  }

}

function prophet_form_views_exposed_form_alter(&$form, &$form_state) {
  if (!isset($form_state['view']->exposed_input['thought_type'])) {
    $form_state['input']['thought_type'] = 'All';
  }
}
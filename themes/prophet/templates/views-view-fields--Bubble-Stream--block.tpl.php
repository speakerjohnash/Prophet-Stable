<?php

/**
 * @file
 * Default simple view template to all the fields as a row.
 *
 * - $view: The view in use.
 * - $fields: an array of $field objects. Each one contains:
 *   - $field->content: The output of the field.
 *   - $field->raw: The raw data for the field, if it exists. This is NOT output safe.
 *   - $field->class: The safe class id to use.
 *   - $field->handler: The Views field handler object controlling this field. Do not use
 *     var_export to dump this object, as it can't handle the recursion.
 *   - $field->inline: Whether or not the field should be inline.
 *   - $field->inline_html: either div or span based on the above flag.
 *   - $field->wrapper_prefix: A complete wrapper containing the inline_html to use.
 *   - $field->wrapper_suffix: The closing tag for the wrapper.
 *   - $field->separator: an optional separator that may appear before a field.
 *   - $field->label: The wrap label text to use.
 *   - $field->label_html: The full HTML of the label to use including
 *     configured element type.
 * - $row: The raw result object from the query, with all data it fetched.
 *
 * @ingroup views_templates
 */
 
$color_class = (empty($row->field_field_type)) ? 'thought' : strtolower($row->field_field_type[0]["raw"]["value"]);
$type_class = "color-" . $color_class;
$privacy_class = $row->field_field_private[0]["raw"]["value"] ? 'private' : 'public';
unset($fields['field_type']);
 
?>
<div class="thought-bubble">
	<div class="<?php print $type_class; print ' ' . $privacy_class; ?>"></div>
</div>
<div class="thought-content <?php print $color_class;?>">
<?php foreach ($fields as $id => $field): ?>
  <?php if (!empty($field->separator)): ?>
    <?php print $field->separator; ?>
  <?php endif; ?>

  <?php print $field->wrapper_prefix; ?>

  	<?php

  		if ($field->label == 'Truth' and $color_class == 'ask') {

  		} else {
  		  print $field->label_html;
        print $field->content;	
  		}

  	?>

  <?php print $field->wrapper_suffix; ?>
<?php endforeach; ?>
</div>
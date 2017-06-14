<?php
/**
 * @file
 * Rate widget theme
 *
 * This is the default template for rate widgets. See section 3 of the README
 * file for information on theming widgets.
 *
 * Available variables:
 * - $results: Array with voting results
 *     array(
 *       'rating' => 12, // Average rating
 *       'count' => 23, // Number of votes
 *       'user_vote' => 80, // Value for user vote. Only available when user has voted.
 *     )
 * - $content_type: "node" or "comment".
 * - $content_id: Node or comment id.
 * - $buttons: Array with themed buttons (built in preprocess function).
 * - $info: String with user readable information (built in preprocess function).
 */

?>

<div class="rate-gradient">
	<div class="rate-gradient-labels">
		<span class="left-label">False</span>
		<span class="percent-label"><?php print $value . "%"; ?></span>
		<span class="right-label">True</span>
	</div>
	<div class="empty-gradient">
		<div style="<?php print 'width: ' . $value . '%'; ?>" class="full-gradient width-transition" data-average="<?php print $value; ?>"></div>
	</div>
</div>
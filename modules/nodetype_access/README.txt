Nodetype access
===============
A node access module that doesn't use the node grants system, but instead uses
Drupal 7's new hook_node_access() and hook_query_alter().

Authors
=======
based on webchick's "Super Simple Access II Turbo Edition"
http://drupal.org/sandbox/webchick/1074988
with some minor fixes and improvements by axel.rutz

EFQ access control submodule
============================
If you do not know what EFQ is, just ignore it. Nodetype access works out of the box for you.

Nodetype access EFQ implements hook_entity_query_alter() to limit any EntityFieldQuery (EFQ).
Unpatched drupal 7.x node.module does not use EFQ to query nodes.
To use EFQ with views see http://drupal.org/project/efq_views

Playing with EFQ access control
===============================
# put this in your devel/php box to see EFQ query altering in action.
# you may want to set the "view [TYPE]" permission first.
# see also test cases

$query = new EntityFieldQuery();

$query = $query
  ->entityCondition('entity_type', 'node')
  ->entityCondition('bundle', array('page','article'), 'in')
  ;

dsm($query);

$result = $query
  ->execute();

dsm($query);
# notice that now $query->entityConditions['bundle'] has changed

dsm($result);

EFQ core bug
============

There is a minor core bug in EFQ, see http://drupal.org/node/1426702
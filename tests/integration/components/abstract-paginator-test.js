import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('abstract-paginator', 'Integration | Component | abstract paginator', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{abstract-paginator}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#abstract-paginator}}
      template block text
    {{/abstract-paginator}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

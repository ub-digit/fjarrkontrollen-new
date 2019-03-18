export default function() {
  this.transition(
    this.fromRoute('admin.index'),
    this.toRoute('admin.post'),
    this.use('toLeft', { duration: 100, easing: 'easeInOut' }),
    this.reverse('toRight', { duration: 100, easing: 'easeInOut' })
  );
  /*
  this.transition(
    this.fromRoute('login'),
    this.toRoute('admin.index'),
    this.use('toUp'),
    this.reverse('toDown')
  );
  */
}

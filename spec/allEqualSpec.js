describe('allEqual', function () {

  var MyType = Ember.Object.extend({
    d: EmberCPM.Macros.allEqual('a', 'c'),
    e: EmberCPM.Macros.allEqual('a', 'b'),
    f: EmberCPM.Macros.allEqual(),
    g: EmberCPM.Macros.allEqual('a'),
    h: EmberCPM.Macros.allEqual('a', 'c', 6),
    i: EmberCPM.Macros.allEqual(Ember.computed.alias('a'), 6),
    j: EmberCPM.Macros.allEqual(EmberCPM.Macros.sum('a','b'), 8),
  });

  var myObj = MyType.create({
    a: 6,
    b: 2,
    c: 6
  });

  it('is properly registered', function () {
    expect(!!EmberCPM.Macros.allEqual).to.equal(true);
  });

  it('compare properties for equality', function () {
    expect(myObj.get('d')).to.equal(true);
    expect(myObj.get('e')).to.equal(false);
    myObj.set('c', '6');
    expect(myObj.get('d')).to.equal(false);
    myObj.set('a', '6');
    expect(myObj.get('d')).to.equal(true);
    myObj.setProperties({
      a: 6,
      c: 6
    });
  });

  it('compare properties and numeric literal for equality', function () {
    expect(myObj.get('h')).to.equal(true);
    myObj.set('a', 8);
    expect(myObj.get('h')).to.equal(false);
    myObj.set('a', '6');
    expect(myObj.get('h')).to.equal(false);
    myObj.set('a', 6);
  });

  it('handles the zero-argument case', function () {
    expect(myObj.get('f')).to.equal(true);
  });

  it('handles the single-argument case', function () {
    expect(myObj.get('g')).to.equal(true);
  });

  it('handles composable CPMs', function () {
    expect(myObj.get('i')).to.equal(true);
    myObj.set('a', 12);
    expect(myObj.get('i')).to.equal(false);
    myObj.set('a', 6);
    expect(myObj.get('j')).to.equal(true);
    myObj.set('b', 4);
    expect(myObj.get('j')).to.equal(false);
  });

});

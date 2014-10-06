describe('sum', function () {
  var sum = EmberCPM.Macros.sum,
    MyType = Ember.Object.extend({
      d: sum('a', 'b'),
      e: sum('a', 'b', 'c'),
      f: sum('a', 'b', 'c', 2),
      g: sum('a'),
      h: sum(2),
      i: sum(),
      j: [1, 2, 3, 4],
      k: sum(Ember.computed.max('j'), 5),
      l: sum(sum('a', 'b'), 5),
    });

  var myObj = MyType.create({
    a: 6,
    b: 7,
    c: 2
  });

  it('is properly registered', function () {
    expect(!!EmberCPM.Macros.sum)
      .to.equal(true);
  });

  it('when passed a single property, returns its value', function () {
    expect(myObj.get('g'))
      .to.equal(6);
  });

  it('when passed a numeric literal, returns its value', function () {
    expect(myObj.get('h'))
      .to.equal(2);
  });

  it('calculates the sum of two basic numeric properties', function () {
    expect(myObj.get('d'))
      .to.equal(13);
  });

  it('returns 0 when passed no arguments', function () {
    expect(myObj.get('i'))
      .to.equal(0);
  });

  it('calculates the sum of three basic numeric properties', function () {
    expect(myObj.get('e'))
      .to.equal(15);
  });

  it('calculates the sum of three basic numeric properties and a numeric constant', function () {
    expect(myObj.get('f'))
      .to.equal(17);
  });

  it('calculates the result of a composable computed property involving max', function () {
    expect(myObj.get('k'))
      .to.equal(9);
  });

  it('calculates the result of a composable computed property involving sum', function () {
    expect(myObj.get('l'))
      .to.equal(18);
  });
});

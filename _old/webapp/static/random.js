/*var view = new org.riceapps.views.DraggableView();
  view.render();

  goog.style.setStyle(view.getElement(), {
    'width': '900px',
    'height': '100px',
    'top': '200px',
    'left': '200px',
    'background-color': 'red',
    'position': 'absolute'
  });

  var target = goog.dom.createDom('div');
  goog.style.setStyle(target, {
    'width': '100px',
    'height': '100px',
    'top': '20px',
    'left': '20px',
    'background-color': 'yellow',
    'position': 'absolute'
  });
  goog.dom.appendChild(document.body, target);
  var innerTarget = goog.dom.createDom('div');
  goog.style.setStyle(innerTarget, {
    'width': '50px',
    'height': '50px',
    'top': '0px',
    'left': '0px',
    'background-color': 'orange',
    'position': 'absolute'
  });
  goog.dom.appendChild(target, innerTarget);
  view.addDropTargetElement(target);
  //*/

  /*for (var i = 0; i < 50; i++) {
    var div = goog.dom.createDom('div');

    goog.style.setStyle(div, {
      'width': '100px',
      'height': '100px',
      'background-color': 'red',
      'position': 'absolute',
      'left': 10 + ((i % 10) * 110) + 'px',
      'top': 10 + (Math.floor(i / 10) * 110) + 'px',
      'animation-delay': (Math.floor(i / 10) * 20) + ((i % 10) * 50) + 'ms',
      'animation-duration': '400ms',
      'animation-timing-function': 'ease'
    });

    goog.dom.classlist.addAll(div, ['animated', Animation.Preset.FADE_IN_UP]);

    goog.dom.appendChild(document.body, div);
  }//*/

  /*var modalView = new org.riceapps.views.ModalView();
  modalView.show();//*/

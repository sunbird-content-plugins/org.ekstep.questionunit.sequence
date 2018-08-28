var SEQController = SEQController || {};
/**
 * intializes renderer template html controller and provides renderer plugin data with controller, 
 * @param {Object} pluginInstance
 * @memberof org.ekstep.questionunit.sequence.seq-template
 */
SEQController.initTemplate = function (pluginInstance) {
  SEQController.pluginInstance = pluginInstance;
};

/**
 * returns complete sequence plugin renderer html, 
 * @param {String} selectedLayout selected layout from editor
 * @param {Object} availableLayout provides list of layouts
 * @memberof org.ekstep.questionunit.sequence.seq-template
 */
SEQController.getQuestionTemplate = function (selectedLayout, availableLayout) {

  SEQController.selectedLayout = selectedLayout;
  var wrapperStart = '<div class="sequencing-content-container plugin-content-container" >';
  var wrapperStartQuestionComponent = '<div class="question-content-container">';
  var wrapperEndQuestionComponent = '</div>';
  var wrapperEnd = '</div><script>SEQController.onDomReady()</script>';
  var getLayout;
  if (availableLayout.horizontal == selectedLayout) {
    getLayout = SEQController.getOptionLayout('horizontal');
  } else {
    getLayout = SEQController.getOptionLayout('vertical');
  }
  return org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() + wrapperStart + wrapperStartQuestionComponent + org.ekstep.questionunit.questionComponent.generateQuestionComponent() + wrapperEndQuestionComponent + getLayout + wrapperEnd;
}

/**
 * returns sequence option html layout based it's type, 
 * @param {String} type either `horizotnal` or `vertical`
 * @memberof org.ekstep.questionunit.sequence.seq-template
 */
SEQController.getOptionLayout = function (type) {
  return '\
  <div class="option-container ' + type + '">' + '\
      <div class="option-block-container">\
      <% _.each(question.data.options,function(val,key){ %>\
          <div data-seqorder=<%= val.sequenceOrder %> class="option-block">\
            <span><%= val.text %></span>\
          </div>\
      <% }) %>\
      </div>\
  </div>';
}

SEQController.onDomReady = function () {
  $(document).ready(function () {
    $(".option-block-container").sortable();
    $(".option-block-container").disableSelection();
  })
}

//# sourceURL=questionunit.seq.renderer.seq-template-controller.js
/**
 *
 * Question Unit plugin to render a SEQ question
 * @class org.ekstep.questionunit.sequence
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Sivashanmugam Kannan <sivashanmugam.kannan@funtoot.com>
 */
org.ekstep.questionunitseq = {};
org.ekstep.questionunitseq.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.sequence',
  _isContainer: true,
  _render: true,
  _selectedAnswers: [],
  _dragulaContainers: [],
  _constant: {
    horizontal: "Horizontal",
    vertial : "Vertical"
  },
  setQuestionTemplate: function () {
    SEQController.initTemplate(this);// eslint-disable-line no-undef
  },

  preQuestionShow: function (event) {
    this._super(event);
    this._question.template = SEQController.getQuestionTemplate(this._question.config.layout, this._constant);
    _.each(this._question.data.options, function(option,index){
      option.sequenceOrder = index + 1;
    })
    if(!this._question.state){
      this._question.data.options = _.shuffle(this._question.data.options);
    } else {
      this._question.data.options = this._question.state.val.seq_rearranged;
    }
    
  },
  postQuestionShow: function (event) {
    var instance = this;
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
  },
  evaluateQuestion: function(event){
    var instance = this;
    var callback = event.target;
    var correctAnswer = true;
    var correctAnswersCount = 0;
    var telemetryValues = [];
    var seq_rearranged = [];
    var totalOptions = instance._question.data.options.length;

    for(var i = 0;i < totalOptions;i++){
      seq_rearranged[i] = {};
    }

    $('.option-block').each(function(actualSeqMapIndex, elem){
      var telObj = {
        'SEQ':[]
      };
      var selectedSeqOrder = parseInt($(elem).data('seqorder')) - 1;
      telObj['SEQ'][actualSeqMapIndex] = instance._question.data.options[actualSeqMapIndex];
      telemetryValues.push(telObj);

      for(var i = 0;i < totalOptions;i++){
        if(instance._question.data.options[i].sequenceOrder == selectedSeqOrder + 1){
          seq_rearranged[actualSeqMapIndex] = instance._question.data.options[i];
        }
      }

      if(selectedSeqOrder == actualSeqMapIndex){
        correctAnswersCount++;
      } else {
        correctAnswer = false;
      }
    })
    var questionScore;
    if(this._question.config.partial_scoring){
      questionScore = (correctAnswersCount / totalOptions) * this._question.config.max_score;
    }else{
      if((correctAnswersCount / totalOptions) == 1){
        questionScore = this._question.config.max_score;
      }else{
        questionScore = 0
      }
    }
    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "sequence": this._question.data.options,
          "seq_rearranged": seq_rearranged
        }
      },
      score: questionScore,
      max_score: this._question.config.max_score,
      values: telemetryValues,
      noOfCorrectAns: correctAnswersCount,
      totalAns: totalOptions
    };
    if (_.isFunction(callback)) {
      callback(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result); // eslint-disable-line no-undef
  },
  logTelemetryItemResponse: function (data) {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, {"type": "INPUT", "values": data});
  }
});
//# sourceURL=questionunit.sequence.renderer.plugin.js
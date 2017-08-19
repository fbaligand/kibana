import _ from 'lodash';
import 'ui/field_format_editor/numeral/numeral';
import { IndexPatternsFieldFormatProvider } from 'ui/index_patterns/_field_format/field_format';
import { BoundToConfigObjProvider } from 'ui/bound_to_config_obj';
import numeral from '@elastic/numeral';
import numeralLanguages from '@elastic/numeral/languages';

const numeralInst = numeral();

numeralLanguages.forEach(function (numeralLanguage) {
  numeral.language(numeralLanguage.id, numeralLanguage.lang);
});



export function StringifyTypesNumeralProvider(Private) {
  const FieldFormat = Private(IndexPatternsFieldFormatProvider);
  const BoundToConfigObj = Private(BoundToConfigObjProvider);

  _.class(Numeral).inherits(FieldFormat);
  function Numeral(params) {
    Numeral.Super.call(this, params);
  }

  Numeral.prototype._convert = function (val) {
    if (val === -Infinity) return '-∞';
    if (val === +Infinity) return '+∞';
    if (typeof val !== 'number') {
      val = parseFloat(val);
    }

    if (isNaN(val)) return '';

    const previousLocale = numeral.language();
    const defaultLocale = this.param('locale');
    numeral.language(defaultLocale);

    const formatted = numeralInst.set(val).format(this.param('pattern'));

    numeral.language(previousLocale);

    return formatted;
  };


  Numeral.factory = function (opts) {
    _.class(Class).inherits(Numeral);
    function Class(params) {
      Class.Super.call(this, params);
    }

    Class.id = opts.id;
    Class.title = opts.title;
    Class.fieldType = 'number';

    Class.paramDefaults = opts.paramDefaults || new BoundToConfigObj({
      pattern: '=format:' + opts.id + ':defaultPattern',
      locale: '=format:number:defaultLocale'
    });

    Class.editor = {
      template: opts.editorTemplate || require('ui/field_format_editor/numeral/numeral.html'),
      controllerAs: 'cntrl',
      controller: opts.controller || function () {
        this.sampleInputs = opts.sampleInputs;
      }
    };

    if (opts.prototype) {
      _.assign(Class.prototype, opts.prototype);
    }

    return Class;
  };

  return Numeral;
}

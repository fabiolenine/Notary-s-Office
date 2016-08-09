'use strict';

module.exports = (value) => {

    if (value != '1' && value != null && value.trim() != '') return 'Pessoa Física';
    return 'Pessoa Jurídica';
    
}
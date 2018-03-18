function formatDocument(docNumber, docType){
  if(docType == documents.cnpj.docType) return formatCnpj(docNumber);
  if(docType == documents.cpf.docType) return formatCpf(docNumber);
  if(docType == documents.rg.docType) return formatRg(docNumber);
}

function formatCnpj(docNumber){
  if (! chkOnlyNumbers.prop('checked')){
    docNumber = docNumber.substring(0,2)  + '.' +
                docNumber.substring(2,5)  + '.' +
                docNumber.substring(5,8)  + '/' +
                docNumber.substring(8,12) + '-' +
                docNumber.substring(12,14);
  }

  return docNumber;
}

function formatCpf(docNumber){
  if (! chkOnlyNumbers.prop('checked')){
    docNumber = docNumber.substring(0,3)  + '.' +
                docNumber.substring(3,6)  + '.' +
                docNumber.substring(6,9) + '-' +
                docNumber.substring(9,11);
  }

  return docNumber;
}

function formatRg(docNumber){
  var len = docNumber.length;
  if (! chkOnlyNumbers.prop('checked')){
    if(len == 7){
      docNumber = docNumber.substring(0,1)  + '.' +
                  docNumber.substring(1,4)  + '.' +
                  docNumber.substring(4,7);
    }
    else if(len == 9){
      docNumber = docNumber.substring(0,2)  + '.' +
                  docNumber.substring(2,5)  + '.' +
                  docNumber.substring(5,8)  + '-' +
                  docNumber.substring(8,9);
    }
  }

  return docNumber;
}

function onlyNumbers(evt){
  var event = evt;
  var value = event.key;
  var pattern = /[0-9]/;
  var regex = new RegExp(pattern);

  if(event.type == 'keypress') event.returnValue = regex.test(value);
  if(event.type == 'paste'){
    //timeout defined to get the field data
    setTimeout(function(){
      txtDocValidation.val(event.srcElement.value.replace(/[^0-9]/g,''));
    }, 10);
  }

}

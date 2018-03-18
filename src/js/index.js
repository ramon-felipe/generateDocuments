var comboDoc = $('#cboDocumentos'),
    comboDocValidation = $('#cboDocumentosValidacao'),
    btnGenerateDoc = $('#btnGeraDoc'),
    txtDoc = $('#txtDoc');
    txtDocHidden = $('#txtDocHidden');
    txtDocValidation = $('#txtDocValidacao'),
    selectedDoc = 'cnpj',
    selectedDocValidation = 'cnpj',
    validationMessage = $('#validationMessage'),
    generationMessage = $('#generationMessage'),
    generalMessage = $('#generalMessage'),
    chkOnlyNumbers = $('#chkOnlyNumbers'),
    documents = {
      'cpf': {
        docSize: 11,
        docType: 'cpf',
        firstDigitIndex: 9,
        secondDigitIndex: 10
      },
      'rg': {
        docSize: [7, 9],
        docType: 'rg',
        digitIndex: 8,
        message: 'Não há uma sequência lógica para a geração de RG.\n' +
                 'Desta forma, o RG pode não ser gerado/validado corretamente.'
      },
      'cnpj': {
        docSize: 14,
        docType: 'cnpj',
        firstDigitIndex: 12,
        secondDigitIndex: 13
      }
    };

///////////////////////
//Document Generation
///////////////////////
comboDoc.on('change', function(){
  selectedDoc = comboDoc.val();
  changeBtnValue(selectedDoc);
  cleanGenerationFields();
  showGeneralMessage(selectedDoc);
  btnGenerateDoc.focus();
});

function changeBtnValue(selectedDoc){
  btnGenerateDoc.text('Gerar ' + selectedDoc.toUpperCase());
}

function cleanGenerationFields(){
  txtDoc.val('');
  txtDocHidden.val('');
}

function showGeneralMessage(selectedDoc){
  if (selectedDoc == documents.rg.docType || selectedDocValidation == documents.rg.docType) {
    generalMessage.fadeIn();
    generalMessage.addClass('small');
    generalMessage.text(documents.rg.message);
    generalMessage.removeClass('hide-message');
  }
  else{
    generalMessage.fadeOut();
    generalMessage.addClass('hide-message');
  }
}

btnGenerateDoc.on('click', function(event){
  var docNumber;
  event.preventDefault();
  //txtDoc.val(formatDocument(selectedDoc, generateDocument(selectedDoc)));
  docNumber = generateDocument(selectedDoc);
  txtDoc.val(formatDocument(docNumber, selectedDoc));
  txtDocHidden.val(docNumber);
});

function generateDocument(docType){
  var docNumbers = [];

  if(docType == documents.cnpj.docType) return generateCnpj(docNumbers);
  if(docType == documents.cpf.docType) return generateCpf(docNumbers);
  if(docType == documents.rg.docType) return generateRg(docNumbers);
}

function generateCnpj(docNumbers){
  //gets first 12 random digits
  docNumbers = randomizeDocNumbers(11);
  //calculate last 2 digits according to the 8 random previous digits
  docNumbers[documents.cnpj.firstDigitIndex] = calculateDigit(11, 5, docNumbers, documents.cnpj.docType);
  docNumbers[documents.cnpj.secondDigitIndex] = calculateDigit(12, 6, docNumbers, documents.cnpj.docType);

  //returns the doc numbers removing the collon wich separates array values
  return docNumbers.join('');
}

function generateCpf(docNumbers){
  //gets first 9 random digits
  docNumbers = randomizeDocNumbers(8);

  //calculate last 2 digits according to the 8 random previous digits
  docNumbers[documents.cpf.firstDigitIndex] = calculateDigit(8, 10, docNumbers, documents.cpf.docType);
  docNumbers[documents.cpf.secondDigitIndex] = calculateDigit(9, 11, docNumbers, documents.cpf.docType);

  //returns the doc numbers removing the collon wich separates array values
  return docNumbers.join('');
}

function generateRg(docNumbers) {
  //generate 6 or 8 random numbers
  var qtyNumbers = documents.rg.docSize[Math.floor(Math.random() * documents.rg.docSize.length)];
  var size = qtyNumbers-2;

  docNumbers = randomizeDocNumbers(size);
  docNumbers[qtyNumbers-1] = calculateDigit(size, 9, docNumbers, documents.rg.docType);

  return docNumbers.join('');
}

function randomizeDocNumbers(qtyNumbers){
  var numbers = new Array();

  for(i=0; i<= qtyNumbers; i++){
    numbers[i] = Math.floor(Math.random() * 10 + 0);
  }

  return numbers;
}

////////////////////////
//Document Validation
///////////////////////
comboDocValidation.on('change', function(){
  selectedDocValidation = comboDocValidation.val();
  showGeneralMessage(selectedDocValidation);
  validateDocument(selectedDocValidation);
  txtDocValidation.focus();
});

function cleanValidationFields(){
  txtDocValidation.val('');
}

txtDocValidation.on('paste', function(){
  onlyNumbers(event);
});

txtDocValidation.on('keypress', function(){
  onlyNumbers(event);
});

txtDocValidation.on('input', function(){
  //this time is necessary when the user pastes a value
  //(it calls a validation to get only numbers)
  setTimeout(function(){
    validateDocument(selectedDocValidation);
  }, 30);
});

function validateDocument(docType){
  var docNumber = txtDocValidation.val();
  var docNumbers = docNumber.split('');
  var sizeInputDocNumber = docNumber.length;

  if(docType == documents.cpf.docType && sizeInputDocNumber == documents.cpf.docSize){
    showMessage(validateCpf(docNumbers), docType);
  }
  else if(docType == documents.rg.docType && (sizeInputDocNumber == documents.rg.docSize[0] || sizeInputDocNumber == documents.rg.docSize[1])){
    showMessage(validateRg(docNumbers), docType);
  }
  else if(docType == documents.cnpj.docType && sizeInputDocNumber == documents.cnpj.docSize){
    showMessage(validateCnpj(docNumbers), docType);
  }
  else if(sizeInputDocNumber == 0){
    hideMessage();
  }
  else{
    showMessage(false, docType);
  }
}

function validateCnpj(docNumbers){
  firstDigit = calculateDigit(11, 5, docNumbers, documents.cnpj.docType);
  secondDigit = calculateDigit(12, 6, docNumbers, documents.cnpj.docType);

  return (firstDigit == docNumbers[documents.cnpj.firstDigitIndex] && secondDigit == docNumbers[documents.cnpj.secondDigitIndex])
}

function validateCpf(docNumbers) {
  firstDigit = calculateDigit(8, 10, docNumbers, documents.cpf.docType);
  secondDigit = calculateDigit(9, 11, docNumbers, documents.cpf.docType);

  return (firstDigit == docNumbers[documents.cpf.firstDigitIndex] && secondDigit == docNumbers[documents.cpf.secondDigitIndex])
}

function validateRg(docNumbers) {
    var size = docNumbers.length - 2;

    digit = calculateDigit(size, 9, docNumbers, documents.rg.docType);
    return (digit == docNumbers[docNumbers.length-1]);
}

function calculateDigit(lastIndex, multiplier, docNumbers, docType){
  var total = 0;
  var digit = 0;
  var resto = 0;

  //CPF Validation
  if(docType == documents.cpf.docType){
    //gets the sum
    for(i=0; i<=lastIndex; i++){
      total += docNumbers[i] * multiplier;
      multiplier--;
    }

    //verify digit
    resto = total % documents.cpf.docSize;

    if (documents.cpf.docSize  - resto <= 9){
      digit = documents.cpf.docSize - resto;
    }
  }

  //RG Validation
  else if(docType == documents.rg.docType){
    //gets the sum
    for(i=0; i<=lastIndex; i++){
      total += docNumbers[lastIndex-i] * multiplier;
      multiplier--;
    }

    //verify digit
    for(i=0; i<=9; i++){
      if (((total + i*100) % 11) == 0) {
        digit = i;
        break;
      }
    }
  }

  //CNPJ Validation
  else if(docType == documents.cnpj.docType){
    for(i=0; i<=lastIndex; i++){
      if (multiplier == 1) multiplier = 9;

      total += docNumbers[i] * multiplier;
      multiplier--;
    }

    resto = total % 11;
    digit = (resto < 2) ? 0 : (11-resto);
  }

  return digit;
}

function showMessage(valid, docType){
  //validationMessage.removeClass('hide-message');
  validationMessage.fadeIn();

  if(valid){
    validationMessage.text(docType.toUpperCase() + ' válido');
    validationMessage.removeClass('alert-danger');
    validationMessage.addClass('alert-success');
  }
  else{
    validationMessage.text(docType.toUpperCase() + ' inválido');
    validationMessage.removeClass('alert-success');
    validationMessage.addClass('alert-danger');
  }
}

function hideMessage(){
  //validationMessage.addClass('hide-message');
  validationMessage.fadeOut();
}

chkOnlyNumbers.on('click', function(){
  var docNumber = txtDocHidden.val();
  selectedDoc = comboDoc.val();

  if (docNumber != '') txtDoc.val(formatDocument(docNumber, selectedDoc));
});

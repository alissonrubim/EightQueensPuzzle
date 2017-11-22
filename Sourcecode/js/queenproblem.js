QueenProblem = new Object(); 
 
QueenProblem.Generation = null; 
QueenProblem.MaximumFitness = null;  
QueenProblem.BoardSize = 8;  
 
QueenProblem.Init = function(){ 
  QueenProblem.MaximumFitness = (QueenProblem.BoardSize-1)*QueenProblem.BoardSize; 
 
  GAEngine.Random.SetSeed(parseInt(Math.random() * 100000));
 
  QueenProblem.Generation = new GAEngine.Generation({
        Debug: true, 
        Delay: 0,
        FitnessTarget: QueenProblem.MaximumFitness,
        MaximumIndexToGiveUp: 100,
        Events: { 
            OnCalculateFitness: QueenProblem.OnCalculateGenerationFitness, 
            OnGiveUp: QueenProblem.OnGiveUp,
            OnStop: QueenProblem.OnStop,
            OnComplete: QueenProblem.OnComplete
        }, 
        Population: {
            SubjectsSize: 500,
            MutationProvability: 1,
            Subject: {
                GenesSize: QueenProblem.BoardSize,
                Events: { 
                    OnCalculateFitness: QueenProblem.OnCalculateSubjectFitness
                }, 
                Gene: {
                  Events: { 
                    OnCreateRandomGeneValue: QueenProblem.OnGenerateRandomGeneValue
                  } 
                } 
            } 
        } 
    }); 
    QueenProblem.Generation.Start();
} 
 
QueenProblem.SubjectGenesToBoard = function(subject){ 
  var board = new Array(); 
 
  for(var i=0; i < subject.Genes.length; i++){ 
    board[i] = new Array(); 
    for(var j =0; j < subject.Genes[i].Value.length; j++){ 
      board[i][j] = subject.Genes[i].Value[j]; 
    } 
  } 
 
  return board; 
} 
 
QueenProblem.DrawBoard = function(board){ 
  var table = $('<table class="board"></table>'); 
  var count = 0;

  for(var i=0; i < board.length; i++){ 
    var tr = $('<tr></tr>'); 
    for(var j =0; j < board[i].length; j++){ 
      var td = $('<td></td>'); 

      if(count%2 != 0)
        td.addClass("black");

      if(board[i][j] == 1) {
        td.addClass("queen");
        //td.append($("<img src='image/crown.png'>"));
      }
      tr.append(td); 
      count++;
    } 
    count++;
    table.append(tr); 
  } 
 
  return table; 
} 
 
 
/* - Events - */ 
QueenProblem.OnCalculateGenerationFitness = function(generation){ 
  //Desenha na tela 
    /*var divMain = $('<div class="main-contents"></div>'); 
    divMain.append('<div class="generation-title">Geração: '+generation.GetCurrentIndex()+'</div>'); 
 
    var divTables = $('<div class="table-contents"></div>'); 
    for(var i = 0; i < generation.Population.Subjects.length; i++){ 
      divTables.append(drawBoard(generation.Population.Subjects[i])); 
    } 
    divMain.append(divTables); 
    $('body').append(divMain); 
    */ 
 
    function drawBoard(subject){ 
      var divTable = $('<div class="div-table"></div>'); 
      divTable.append(QueenProblem.DrawBoard(QueenProblem.SubjectGenesToBoard(subject))); 
      divTable.append("<div class='subject-data'>Fitness:" + subject.GetFitness() + '<br>Conflitos: ' +(generation.FitnessTarget - subject.GetFitness())+ '</div>'); 
      return divTable; 
    } 
 
 
    var sumFitness = 0; 
    var bestFitness = 0; 
  for(var i = 0; i < generation.Population.Subjects.length; i++){ 
    var subject = generation.Population.Subjects[i]; 
        sumFitness += subject.GetFitness(); 
        if(subject.GetFitness() >= bestFitness){ 
          bestFitness = subject.GetFitness(); 
        } 
 
        if(subject.GetFitness() - 1 /*-1 porque devolve o valor da roleta*/>= generation.FitnessTarget){ 
          $('body').append("Achei na geração: " +generation.GetCurrentIndex()+"</div>");  
          $('body').append(drawBoard(subject)); 
          return subject.GetFitness(); 
        } 
  } 
 
    return bestFitness; 
} 
 
QueenProblem.OnGiveUp = function(generation){ 
  alert('giveup'); 
} 
 
QueenProblem.OnStop = function(generation){ 
  alert('stop');   
} 
 
QueenProblem.OnComplete = function(generation){ 
  alert('complete'); 
} 
 
QueenProblem.OnCalculateSubjectFitness = function(subject){ 
  var board = QueenProblem.SubjectGenesToBoard(subject); 
 
  function columnConflict(row, col){ 
    var c = 0; 
 
    if(board[row][col] == 1){ 
      for(var j = row + 1; j < 8; j++) 
        if(board[j][col] == 1) 
          c++; 
 
      for(var j = row - 1; j >= 0; j--) 
        if(board[j][col] == 1) 
          c++; 
    } 
 
    return c; 
  } 
 
  function diagonalConflict(row, col){ 
    var c = 0; 
 
    if(board[row][col] == 1){ 
      for(var i = row + 1, j = col + 1;  
        i < 8 && j < 8; i++, j++) 
        if(board[i][j] == 1) 
          c++; 
 
      for(var i = row - 1, j = col - 1;  
        i >= 0 && j >= 0; i--, j--) 
        if(board[i][j] == 1) 
          c++; 
         
 
      for(var i = row + 1, j = col - 1;  
        i < 8 && j >= 0; i++, j--) 
        if(board[i][j] == 1) 
          c++; 
         
      for(var i = row - 1, j = col + 1;  
        i >= 0 && j < 8; i--, j++) 
        if(board[i][j] == 1) 
          c++; 
 
    } 
     
    return c; 
  } 
 
  var conflit = 0; 
  for(var row = 0; row < 8; row++){  
    for(var col = 0; col < 8; col++){  
      conflit += columnConflict(row, col); 
      conflit += diagonalConflict(row, col); 
    } 
  } 
 
  return (QueenProblem.MaximumFitness - conflit) + 1; 
} 
 
QueenProblem.OnGenerateRandomGeneValue = function(gene){   
  var boardLine = new Array(); 
 
  for(var i=0; i< QueenProblem.BoardSize; i++) 
    boardLine[i] = 0; 
 
  boardLine[GAEngine.Random.GetBetween(0, QueenProblem.BoardSize)] = 1; 
 
  return boardLine; 
}
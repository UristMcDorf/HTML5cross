var columnHintCellCount = 0, columnHints, context, cellSize = 10, image, rowHintCellCount = 0, rowHints, playerSolution;
var $canvas;
const alreadyFilledBit = 1 << 15; //so that cells don't flicker when we drag over them, we mark them with this bit; we're not going to use more than 2^14 colours, I hope, but it can be expanded anyway
const crossedOutCellBit = 1 << 16; //to mark cells that have been crossed

function GeneratePuzzle()
{
    var setLength = 0;

    rowHints = new Array(image.height);
    columnHints = new Array(image.width);
    
    playerSolution = new Array(image.height);
    
    for (var i = 0, hintCount = 0; i < image.height; i++)
    {
        playerSolution[i] = new Array(image.width);
    
        rowHints[i] = "";
        var rowData = context.getImageData(0, i, image.width, 1);
        
        for (var j = 3; j < rowData.data.length; j += 4)
        {
            if (rowData.data[j] == 255)
            {
                setLength++;
            } else {
                if (setLength > 0)
                {
                    rowHints[i] = rowHints[i].concat(setLength + " ");
                    setLength = 0;
                    
                    hintCount++;
                }
            }
        }
        
        if (setLength > 0)
        {
            rowHints[i] = rowHints[i].concat(setLength);
            setLength = 0;
            
            hintCount++;
        } else {
            rowHints[i] = rowHints[i].trim();
        }
        
        if (hintCount > rowHintCellCount)
        {
            rowHintCellCount = hintCount;
        }
        hintCount = 0;
        
        if (rowHints[i] == "")
        {
            rowHints[i] = "0";
        }
    }
    
    for (var i = 0, hintCount = 0; i < image.width; i++)
    {
        columnHints[i] = "";
        var columnData = context.getImageData(i, 0, 1, image.height);
        
        for (var j = 3; j < columnData.data.length; j += 4)
        {
            if (columnData.data[j] == 255)
            {
                setLength++;
            } else {
                if (setLength > 0)
                {
                    columnHints[i] = columnHints[i].concat(setLength + " ");
                    setLength = 0;
                    
                    hintCount++;
                }
            }
        }
        
        if (setLength > 0)
        {
            columnHints[i] = columnHints[i].concat(setLength);
            setLength = 0;
            
            hintCount++;
        } else {
            columnHints[i] = columnHints[i].trim();
        }
        
        if (hintCount > columnHintCellCount)
        {
            columnHintCellCount = hintCount;
        }
        hintCount = 0;
        
        if (columnHints[i] == "")
        {
            columnHints[i] = "0";
        }
    }
    
    
    for (var y = 0; y < playerSolution.length; y++)
    {
        for (var x = 0; x < playerSolution[y].length; x++)
        {
            playerSolution[y][x] = 0;
        }
    }
    
    context.canvas.width = (image.width + rowHintCellCount) * cellSize + 1;
    context.canvas.height = (image.height + columnHintCellCount) * cellSize + 1;
}

function DrawGrid()
{
    context.beginPath();
    
    for (var x = 0.5 + (rowHintCellCount * cellSize); x < context.canvas.width; x += cellSize)
    {
        context.moveTo(x, columnHintCellCount * cellSize);
        context.lineTo(x, context.canvas.height);
    }
    
    for (var y = 0.5 + (columnHintCellCount * cellSize); y < context.canvas.height; y += cellSize)
    {
        context.moveTo(rowHintCellCount * cellSize, y);
        context.lineTo(context.canvas.width - 1, y);
    }
    
    context.strokeStyle = "#bbb";
    context.stroke();
}

function DrawHints()
{
    context.beginPath();

    context.font = cellSize + "px sans-serif";
    
    for (var x = 0.5 + (rowHintCellCount * cellSize); x < context.canvas.width; x += cellSize)
    {
        context.moveTo(x, 0);
        context.lineTo(x, context.canvas.height);
    }
    context.moveTo(0.5, columnHintCellCount * cellSize);
    context.lineTo(0.5, context.canvas.height);

    for (var y = 0.5 + (columnHintCellCount * cellSize); y < context.canvas.height; y += cellSize)
    {
        context.moveTo(0, y);
        context.lineTo(context.canvas.width - 1, y);
    }
    context.moveTo(rowHintCellCount * cellSize, 0.5);
    context.lineTo(context.canvas.width, 0.5);
    
    context.strokeStyle = "bbb";
    context.stroke();
    
    context.beginPath();
    context.fillStyle = "black";
    
    // I forgot the story behind these magic calculations, but it works, so...
    for (var row = 0; row < image.height; row++)
    {
        var hints = rowHints[row].split(" ");
        for (var i = 1; i <= hints.length; i++)
        {
            context.fillText(hints[hints.length - i],
                ((rowHintCellCount - i) * cellSize) + (cellSize / 5),
                ((columnHintCellCount + row + 1) * cellSize) - (cellSize / 10)
            );
        }
    }
    
    for (var column = 0; column < image.width; column++)
    {
        var hints = columnHints[column].split(" ");
        for (var i = 1; i <= hints.length; i++)
        {
            context.fillText(hints[hints.length - i],
                ((rowHintCellCount + column + 0.25) * cellSize) - 1,
                ((columnHintCellCount - i + 1) * cellSize) - (cellSize / 10)
            );
        }
    }
}

function SetUpEvents()
{
    var isMouseDown = false, whichButton = 0;
    
    $(context.canvas).mousedown(function(eventArguments)
    {
        isMouseDown = true;
        whichButton = eventArguments.which;
        
        var cell = GetCell(eventArguments.pageX, eventArguments.pageY);
        
        if(cell.x < 0 || cell.y < 0) return; //only possible if it's outside the puzzle area

        switch (whichButton)
        {
            default:
                break;
            
            case 1:        // LMB
                FillCell(cell, 1); //black atm; TODO: make it currently selected colour
                break;
            case 3:        // RMB
                FillCell(cell, crossedOutCellBit); //supposed to be cross, red colour atm
                break;
        }
            
        Render();
    });
    
    $(context.canvas).mouseup(function(eventArguments)
    {
        isMouseDown = false;
        
        for(var i = 0; i < playerSolution.length; i++) //since we stopped dragging, clear out the bits that indicate the cells we've dragged over this pass
            for(var j = 0; j < playerSolution[i].length; j++)
                playerSolution[i][j] = playerSolution[i][j] & ~alreadyFilledBit;
            
        Render();
    });
    
    $(context.canvas).mousemove(function(eventArguments)
    {
        if(!isMouseDown) return;
        
        var cell = GetCell(eventArguments.pageX, eventArguments.pageY);
                
        if(cell.x < 0 || cell.y < 0) return; //only possible if it's outside the puzzle area

        switch (whichButton)
        {
            default:
                break;
            
            case 1:        // LMB
                FillCell(cell, 1); //black atm; TODO: make it currently selected colour
                break;
            case 3:        // RMB
                FillCell(cell, crossedOutCellBit); //supposed to be cross, red colour atm
                break;
        }
            
        Render();
    });
}

function FillCell(cell, value)
{
    var cellValue = playerSolution[cell.y][cell.x];
        
    if((cellValue | alreadyFilledBit) == cellValue) return; //if it was already filled in this pass, return; we do not need flickering cells every time you move your mouse
        
    playerSolution[cell.y][cell.x] = ((cellValue != 0)? 0 : value) | alreadyFilledBit; //paint if empty, erase if not; either way mark it as already fiddled with this pass of the mouse
        
    return;
}

function GetCell(pixelX, pixelY)
{
    var cell = 
    {
            x: pixelX - $canvas.offset().left - (rowHintCellCount * cellSize),
            y: pixelY - $canvas.offset().top - (columnHintCellCount * cellSize)
    };
    
    if(cell.x >= 0 && cell.x < $canvas.width() && cell.y >= 0 && cell.y < $canvas.height())
    {
        cell.x = Math.floor(cell.x / cellSize);
        cell.y = Math.floor(cell.y / cellSize);
    }
    else //if it's outside the puzzle area, return impossible values
    {
        cell.x = -1;
        cell.y = -1;
    }
    
    return cell;
}

function ClearCanvas()
{
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.restore();
    
}

function Render()
{
    ClearCanvas();
    
    DrawGrid();
    DrawHints();
    
    // Render player solution. Should probably put in another function.
    for (var y = 0; y < playerSolution.length; y++)
    {
        for (var x = 0; x < playerSolution[y].length; x++)
        {
            if (playerSolution[y][x] != 0)
            {
                context.beginPath();
                
                switch (playerSolution[y][x] & ~alreadyFilledBit)
                {
                default:
                    break;
                
                case crossedOutCellBit:    // Red box
                    context.rect((rowHintCellCount * cellSize) + (x * cellSize),
                        (columnHintCellCount * cellSize) + (y * cellSize),
                        cellSize, cellSize);
                    context.fillStyle = "red";
                    break;
                case 1:        // Black box
                    context.rect((rowHintCellCount * cellSize) + (x * cellSize),
                        (columnHintCellCount * cellSize) + (y * cellSize),
                        cellSize, cellSize);
                    context.fillStyle = "black";
                    break;
                }
            
                context.fill();
            }
        }
    }
}
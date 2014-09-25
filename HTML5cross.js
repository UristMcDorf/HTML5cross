var columnHintCellCount = 0, columnHints, context, cellSize = 10, image, rowHintCellCount = 0, rowHints;
var $canvas;


function GeneratePuzzle()
{
    var setLength = 0;

    rowHints = new Array(image.height);
    columnHints = new Array(image.width);
    
    for (var i = 0, hintCount = 0; i < image.height; i++)
    {
        rowHints[i] = "";
        var rowData = context.getImageData(0, i, image.width, 1);
        
        for (var j = 3; j < rowData.data.length; j += 4)
        {
            if (rowData.data[j] == 255)
            {
                setLength++;
            }
            else
            {
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
        }
        else
        {
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
            }
            else
            {
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
        }
        else
        {
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
    
    /*for (var i = 0; i < image.height; i++)
    {
        console.log("Row " + i + " hint: " + rowHints[i]);
    }
    console.log("Row cell count: " + rowHintCellCount);
    
    for (var i = 0; i < image.width; i++)
    {
        console.log("Column " + i + " hint: " + columnHints[i]);
    }
    console.log("Column cell count: " + columnHintCellCount);*/
    
    context.canvas.width = (image.width + rowHintCellCount) * cellSize + 1;
    context.canvas.height = (image.height + columnHintCellCount) * cellSize + 1;
}

function DrawGrid()
{
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
    
    for (var row = 0; row < image.height; row++)
    {
        var hints = rowHints[row].split(" ");
        for (var i = 1; i <= hints.length; i++)
        {
            context.fillText(hints[hints.length - i], (rowHintCellCount - i) * cellSize + (cellSize / 5), ((columnHintCellCount + row + 1) * cellSize) - (cellSize / 10));
        }
    }
    
    for (var column = 0; column < image.width; column++)
    {
        var hints = columnHints[column].split(" ");
        for (var i = 1; i <= hints.length; i++)
        {
            context.fillText(hints[hints.length - i], (rowHintCellCount + column + 0.25) * cellSize - 1, ((columnHintCellCount - i + 1) * cellSize) - (cellSize / 10));
        }
    }
    
    context.stroke();
}

function SetUpEvents()
{
    $(context.canvas).click(function(eventArgs)
                            {
                                var cursor =
                                {
                                    x: eventArgs.pageX - $canvas.offset().left - (rowHintCellCount * cellSize),
                                    y: eventArgs.pageY - $canvas.offset().top - (columnHintCellCount * cellSize)
                                };
                                
                                if (cursor.x >= 0 && cursor.x < $canvas.width()
                                    &&
                                    cursor.y >= 0 && cursor.y < $canvas.height())
                                {
                                    var cell =
                                    {
                                        column: Math.floor(cursor.x / cellSize),
                                        row: Math.floor(cursor.y / cellSize)
                                    };
                                    
                                    context.rect((rowHintCellCount * cellSize) + (cell.column * cellSize),
                                                 (columnHintCellCount * cellSize) + (cell.row * cellSize),
                                                 cellSize, cellSize);
                                    context.fillStyle = "black";
                                    context.fill();
                                }
                            });
}
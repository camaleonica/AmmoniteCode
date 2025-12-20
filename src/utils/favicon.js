// Función para crear un favicon dinámico con arte ASCII
export const setAsciiFavicon = () => {
  // Versión completa del arte ASCII para el favicon
  const asciiArt = `                                 .........@............                             

                            ....@@@@.....@@..........@......                        

                         ...@@@@..@.....@@.........@..@@...@...                     

                      ..@......@........@..........@@.............                  

                   ...........@@@................@..................                

                 ..@@@........@.....@.@.........@.....................              

                .@@@@@.......@........@.......@@........@..............             

              ..@@@..@.......@........@..............................@...           

             .@@.....@@.......................@@..........................          

            .@@@@..............@.....@..@...@.@@...........................         

           .@@@@@...............@@......@......@............................        

          .@@@@@...@.............@@@..@@@.@@@@@@...@....@....................       

          @@@@@@.@.........@@..@@@@@.@@@.@@@@@@.@......@......................      

         .@..@@.@........@.@.@@@@@@....@@@@@@@.@@@.@.@@...............@.......      

        .@@@@..@.@@@@@@@@.@@.@@...@@@@@..@@...@@@@@.........................@.      

        .@@@@@@..@.@.@..@@@@...@..@@.@.@@.....@..@@.............@@@@@@@@@......     

        @@@@@@@@@@@.@@@@@......@.@@@.@@@....@...@..@@@....@@..@@..........@@@@.     

        @@@@@@@@@@@@@@@@@......@@....@@@...........@.@@@@@..@@..............@@..    

       .@@@@@@@@@..@@@@@.@........@@.@@@@......@@@@@@.@@@@@@@................@..    

       ..@@@@@@@...@@@@@@@@.@..@@.........@@.@.......@.@@@@@..........@.....@@..    

       .@@@@@@@@@@@@@@@.@@@.@@@@.................@@@...@@@@.................@@@.    

        @@@@@@@@@@@@@.@....@@@@..........@.@..@@.....@@.@@@@.................@@.    

        .@.@@@@@@@@...@...............................@.@@@@@................@@.    

        .@.....@@......@.@..@@@.....@@......@@@@@@@@@@@.@@@@@@.........@....@@@.    

        .@@..........@@..@@.@..@.....................@@.@@@@@@@@@@@....@...@@@..    

        ..@@.......@@...@.@@..@.@@@@@@@....@@@@@@@@...@.. ...@@@@@.....@@@@@@@.     

         .@@.@@@@@@.........@@...........@.@..@..@.@@.@.      ...@@@..@@.@@@@@.     

          .@@@@..........@@@@@@@@@..@@.@..........@@@..          ..@@@..@@@@@.      

          ..@.....@@......@@.....@@@..@......@@@....@@.            .@@@@@@@@@.      

            @@...........@@.....@@@@...@.......@......              ..@@@@@@.       

             .@..........@........@.@...@...@......@.                .@@@@@@        

              .@@......@@...........@@....@.....@@.                   .@@@@.        

                .@@@..............@.@@.........@..                    ..@..         

                  ..@............@@@@...@..@@...                       ...          

                     ..@@@@@@....@@@.........                          .            

                          .......@.......                                           `;

  const canvas = document.createElement('canvas');
  const size = 128; // Tamaño más grande para mejor calidad
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // Fondo negro semi-transparente para mejor contraste
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, size, size);

  // Configurar fuente monoespaciada
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Procesar líneas del arte ASCII
  const lines = asciiArt.split('\n').filter(line => line.trim().length > 0);
  if (lines.length === 0) return;

  const maxWidth = Math.max(...lines.map(line => line.length));
  const lineHeight = size / lines.length;
  const charWidth = size / maxWidth;
  const fontSize = Math.min(charWidth, lineHeight) * 0.85; // 85% para dejar margen

  ctx.font = `${fontSize}px 'Aujournuit', 'Aujournuit-Wide'`;

  // Dibujar cada línea del arte ASCII
  lines.forEach((line, index) => {
    const y = index * lineHeight + (lineHeight - fontSize) / 2;
    // Centrar horizontalmente
    const x = (size - line.length * charWidth) / 2;
    ctx.fillText(line, x, y);
  });

  // Convertir a data URL y establecer como favicon
  const dataUrl = canvas.toDataURL('image/png');
  
  // Buscar o crear el link del favicon
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = dataUrl;
};


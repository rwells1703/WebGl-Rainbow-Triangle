function initShaderProgram(gl, vertexShaderSource, fragmentShaderSoruce) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSoruce);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    let shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initPositionBuffer(gl, positions) {
    let positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
    );

    return positionBuffer;
}

function drawScene(gl, shaderProgram, positionBuffer, numPositions) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let posComponents = 2;
    let colorComponents = 4;

    gl.vertexAttribPointer(
        gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        posComponents,
        gl.FLOAT,
        false,
        (posComponents+colorComponents)*4,
        0
    );

    gl.vertexAttribPointer(
        gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        colorComponents,
        gl.FLOAT,
        false,
        (posComponents+colorComponents)*4,
        posComponents*4
    );

    gl.enableVertexAttribArray(
        gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    );

    gl.enableVertexAttribArray(
        gl.getAttribLocation(shaderProgram, 'aVertexColor')
    );

    gl.useProgram(shaderProgram);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions / (posComponents + colorComponents));
}

function main() {
    let canvas = document.querySelector("#glCanvas");
    
    if (document.body.clientWidth < document.body.clientHeight) {
        dimension = document.body.clientWidth;
    } else {
        dimension = document.body.clientHeight;
    }

    canvas.width = dimension;
    canvas.height = dimension;
    
    let gl = canvas.getContext("webgl");

    if (gl === null)
      return;

    let vertexShaderSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        varying vec4 vVertexColor;

        void main() {
            gl_Position = aVertexPosition;
            vVertexColor = aVertexColor;
        }
    `;

    let fragmentShaderSource = `
        varying lowp vec4 vVertexColor;

        void main() {
            gl_FragColor = vVertexColor;
        }
    `;

    let shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

    let positions = [
        0.0, 0.8, 1.0, 0.0, 0.0, 1.0,
        -0.8, -0.8, 0.0, 1.0, 0.0, 1.0,
        0.8, -0.8, 0.0, 0.0, 1.0, 1.0,
    ];

    let positionBuffer = initPositionBuffer(gl, positions);

    drawScene(gl, shaderProgram, positionBuffer, positions.length);
}

main();
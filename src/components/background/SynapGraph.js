function random(min, max) {
  return Math.floor((max - min + 1) * Math.random() + min)
}
class SynapGraph {
  constructor(gridSize, canvas) {
    /* 
      node is in format [x,y]
      edge is in format [node1,node2]
    */
    this.extraCeilsPerSide = 2
    this.colOffset = 2
    this.nodes = []
    this.edges = []
    this.gridSize = gridSize
    this.canvas = canvas
    this.ceilsPerRow =
      Math.ceil(canvas.width / gridSize) + this.extraCeilsPerSide * 2
    this.ceilsPerCol =
      Math.ceil(canvas.height / gridSize) + this.extraCeilsPerSide * 2
    this.padding = Math.floor(gridSize / 10)

    // target position used to update node position
    this.targets = []
    // represented by [cosineTheta,sineTheta], theta is angle from positive x-axis
    this.targetDirectionList = []
  }

  reset() {
    this.nodes = []
    this.edges = []
  }

  generateNode(col, row) {
    return [
      (row - this.extraCeilsPerSide) * this.gridSize +
        random(this.padding, this.gridSize - this.padding),
      (col - this.extraCeilsPerSide) * this.gridSize +
        random(this.padding, this.gridSize - this.padding),
    ]
  }

  setTarget(nodeIndex) {
    const col = Math.floor(nodeIndex / this.ceilsPerRow)
    const row = nodeIndex % this.ceilsPerRow

    const target = this.generateNode(col, row)
    this.targets[nodeIndex] = target
    const node = this.nodes[nodeIndex]
    const diffX = target[0] - node[0]
    const diffY = target[1] - node[1]
    const deno = Math.sqrt(diffX * diffX + diffY * diffY)
    const cosineTheta = deno === 0 ? 0 : diffX / deno
    const sineTheta = deno === 0 ? 0 : diffY / deno
    this.targetDirectionList[nodeIndex] = [cosineTheta, sineTheta]
  }

  updateNode(nodeIndex, movingDistance) {
    const node = this.nodes[nodeIndex]
    let target = this.targets[nodeIndex]

    if (!target) {
      this.setTarget(nodeIndex)
      target = this.targets[nodeIndex]
    }
    const targetDirection = this.targetDirectionList[nodeIndex]

    const cosineTheta = targetDirection[0]
    const sineTheta = targetDirection[1]

    const movingX = cosineTheta * movingDistance
    const movingY = sineTheta * movingDistance

    node[0] += movingX
    node[1] += movingY

    // node position is bounded by target position
    node[0] =
      targetDirection[0] >= 0
        ? Math.min(target[0], node[0])
        : Math.max(target[0], node[0])
    node[1] =
      targetDirection[1] >= 0
        ? Math.min(target[1], node[1])
        : Math.max(target[1], node[1])

    if (
      (node[0] === target[0] || cosineTheta === 0) &&
      (sineTheta === 0 || node[1] === target[1])
    ) {
      // set next target
      this.setTarget(nodeIndex)
    }
  }

  generateGraph() {
    for (let i = 0; i < this.ceilsPerCol; i += 1) {
      for (let j = 0; j < this.ceilsPerRow; j += 1) {
        const node = this.generateNode(i, j)
        this.nodes.push(node)

        const nodeIndex = this.nodes.length - 1
        if (j > 0) {
          // connect hori edge
          this.edges.push([this.nodes[nodeIndex - 1], node])
        }
        if (i > 0) {
          // connect verti edge
          this.edges.push([this.nodes[nodeIndex - this.ceilsPerRow], node])
        }
        if (i > 0 && j > 0) {
          // connect diagonal edge
          if (Math.random() < 0.5) {
            // forward diag
            this.edges.push([
              this.nodes[nodeIndex - this.ceilsPerRow],
              this.nodes[nodeIndex - 1],
            ])
          } else {
            // backward diag
            this.edges.push([
              this.nodes[nodeIndex - 1 - this.ceilsPerRow],
              this.nodes[nodeIndex],
            ])
          }
        }
      }
    }
  }
}
export default SynapGraph

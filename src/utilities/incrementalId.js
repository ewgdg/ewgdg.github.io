class IdGenerator {
  constructor() {
    this.id = 0
  }

  getId() {
    const res = this.id
    this.id += 1
    return res
  }
}
export default IdGenerator

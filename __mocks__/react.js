const React = jest.requireActual("react")
module.exports = {
  ...React,
  useContext: jest.fn().mockImplementation(React.useContext),
}

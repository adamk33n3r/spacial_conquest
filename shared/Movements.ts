enum Movements {
    Idle          = 0,
    ForwardThrust = 1 << 0,
    ReverseThrust = 1 << 1,
    LeftThrust    = 1 << 2,
    RightThrust   = 1 << 3
};

export default Movements;

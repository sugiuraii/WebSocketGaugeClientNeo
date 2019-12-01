/* 
 * The MIT License
 *
 * Copyright 201 sz2.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

export enum AssettoCorsaSHMPhysicsParameterCode
{
    Gas,
    Brake,
    Fuel,
    Gear,
    Rpms,
    SteerAngle,
    SpeedKmh,
    Velocity,
    AccG,
    WheelSlip,
    WheelLoad,
    WheelsPressure,
    WheelAngularSpeed,
    TyreWear,
    TyreDirtyLevel,
    TyreCoreTemperature,
    CamberRad,
    SuspensionTravel,
    Drs,
    TC,
    Heading,
    Pitch,
    Roll,
    CgHeight,
    CarDamage,
    NumberOfTyresOut,
    PitLimiterOn,
    Abs,
    KersCharge,
    KersInput,
    AutoShifterOn,
    RideHeight,
    TurboBoost,
    Ballast,
    AirDensity,
    AirTemp,
    RoadTemp,
    LocalAngularVelocity,
    FinalFF,
    PerformanceMeter,
    EngineBrake,
    ErsRecoveryLevel,
    ErsPowerLevel,
    ErsHeatCharging,
    ErsisCharging,
    KersCurrentKJ,
    DrsAvailable,
    DrsEnabled,
    BrakeTemp,
    Clutch,
    TyreTempI,
    TyreTempM,
    TyreTempO,
    IsAIControlled,
    TyreContactPoint,
    TyreContactNormal,
    TyreContactHeading,
    BrakeBias,
    LocalVelocity,

    //Custom parameter code
    ManifoldPressure
}

export enum AssettoCorsaSHMGraphicsParameterCode
{
    Status,
    Session,
    CurrentTime,
    LastTime,
    BestTime,
    Split,
    CompletedLaps,
    Position,
    iCurrentTime,
    iLastTime,
    iBestTime,
    SessionTimeLeft,
    DistanceTraveled,
    IsInPit,
    CurrentSectorIndex,
    LastSectorTime,
    NumberOfLaps,
    TyreCompound,
    ReplayTimeMultiplier,
    NormalizedCarPosition,
    CarCoordinates,
    PenaltyTime,
    Flag,
    IdealLineOn,
    IsInPitLane,
    SurfaceGrip,
    MandatoryPitDone
}

export enum AssettoCorsaSHMStaticInfoParameterCode
{
    SMVersion,
    ACVersion,
    NumberOfSessions,
    NumCars,
    CarModel,
    Track,
    PlayerName,
    PlayerSurname,
    PlayerNick,
    SectorCount,
    MaxTorque,
    MaxPower,
    MaxRpm,
    MaxFuel,
    SuspensionMaxTravel,
    TyreRadius,
    MaxTurboBoost,
    PenaltiesEnabled,
    AidFuelRate,
    AidTireRate,
    AidMechanicalDamage,
    AidAllowTyreBlankets,
    AidStability,
    AidAutoClutch,
    AidAutoBlip,
    HasDRS,
    HasERS,
    HasKERS,
    KersMaxJoules,
    EngineBrakeSettingsCount,
    ErsPowerControllerCount,
    TrackSPlineLength,
    TrackConfiguration,
    ErsMaxJ,
    IsTimedRace,
    HasExtraLap,
    CarSkin,
    ReversedGridPositions,
    PitWindowStart,
    PitWindowEnd
}

export enum AssettoCorsaSHMStringVALCode
{
    Status,
    Session,
    CurrentTime,
    LastTime,
    BestTime,
    Split,
    
    TyreCompound,

    Flag,

    SMVersion,
    ACVersion,

    CarModel,
    Track,
    PlayerName,
    PlayerSurname,
    PlayerNick,

    TrackConfiguration,

    CarSkin
}

export enum AssettoCorsaSHMNumericalVALCode
{
    Gas,
    Brake,
    Fuel,
    Gear,
    Rpms,
    SteerAngle,
    SpeedKmh,
    Velocity,
    AccG,
    WheelSlip,
    WheelLoad,
    WheelsPressure,
    WheelAngularSpeed,
    TyreWear,
    TyreDirtyLevel,
    TyreCoreTemperature,
    CamberRad,
    SuspensionTravel,
    Drs,
    TC,
    Heading,
    Pitch,
    Roll,
    CgHeight,
    CarDamage,
    NumberOfTyresOut,
    PitLimiterOn,
    Abs,
    KersCharge,
    KersInput,
    AutoShifterOn,
    RideHeight,
    TurboBoost,
    Ballast,
    AirDensity,
    AirTemp,
    RoadTemp,
    LocalAngularVelocity,
    FinalFF,
    PerformanceMeter,
    EngineBrake,
    ErsRecoveryLevel,
    ErsPowerLevel,
    ErsHeatCharging,
    ErsisCharging,
    KersCurrentKJ,
    DrsAvailable,
    DrsEnabled,
    BrakeTemp,
    Clutch,
    TyreTempI,
    TyreTempM,
    TyreTempO,
    IsAIControlled,
    TyreContactPoint,
    TyreContactNormal,
    TyreContactHeading,
    BrakeBias,
    LocalVelocity,

    //Custom parameter code
    ManifoldPressure,

    CompletedLaps,
    Position,
    iCurrentTime,
    iLastTime,
    iBestTime,
    SessionTimeLeft,
    DistanceTraveled,
    IsInPit,
    CurrentSectorIndex,
    LastSectorTime,
    NumberOfLaps,
    ReplayTimeMultiplier,
    NormalizedCarPosition,
    CarCoordinates,
    PenaltyTime,

    IdealLineOn,
    IsInPitLane,
    SurfaceGrip,
    MandatoryPitDone,

    NumberOfSessions,
    NumCars,

    SectorCount,
    MaxTorque,
    MaxPower,
    MaxRpm,
    MaxFuel,
    SuspensionMaxTravel,
    TyreRadius,
    MaxTurboBoost,
    PenaltiesEnabled,
    AidFuelRate,
    AidTireRate,
    AidMechanicalDamage,
    AidAllowTyreBlankets,
    AidStability,
    AidAutoClutch,
    AidAutoBlip,
    HasDRS,
    HasERS,
    HasKERS,
    KersMaxJoules,
    EngineBrakeSettingsCount,
    ErsPowerControllerCount,
    TrackSPlineLength,

    ErsMaxJ,
    IsTimedRace,
    HasExtraLap,

    ReversedGridPositions,
    PitWindowStart,
    PitWindowEnd
}

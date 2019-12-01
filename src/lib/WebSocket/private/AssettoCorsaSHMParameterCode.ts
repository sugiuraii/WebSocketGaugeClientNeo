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

export namespace AssettoCorsaSHMPhysicsParameterCode
{
    export const Gas = "Gas";
    export const Brake = "Brake";
    export const Fuel = "Fuel";
    export const Gear = "Gear";
    export const Rpms = "Rpms";
    export const SteerAngle = "SteerAngle";
    export const SpeedKmh = "SpeedKmh";
    export const Velocity = "Velocity";
    export const AccG = "AccG";
    export const WheelSlip = "WheelSlip";
    export const WheelLoad = "WheelLoad";
    export const WheelsPressure = "WheelsPressure";
    export const WheelAngularSpeed = "WheelAngularSpeed";
    export const TyreWear = "TyreWear";
    export const TyreDirtyLevel = "TyreDirtyLevel";
    export const TyreCoreTemperature = "TyreCoreTemperature";
    export const CamberRad = "CamberRad";
    export const SuspensionTravel = "SuspensionTravel";
    export const Drs = "Drs";
    export const TC = "TC";
    export const Heading = "Heading";
    export const Pitch = "Pitch";
    export const Roll = "Roll";
    export const CgHeight = "CgHeight";
    export const CarDamage = "CarDamage";
    export const NumberOfTyresOut = "NumberOfTyresOut";
    export const PitLimiterOn = "PitLimiterOn";
    export const Abs = "Abs";
    export const KersCharge = "KersCharge";
    export const KersInput = "KersInput";
    export const AutoShifterOn = "AutoShifterOn";
    export const RideHeight = "RideHeight";
    export const TurboBoost = "TurboBoost";
    export const Ballast = "Ballast";
    export const AirDensity = "AirDensity";
    export const AirTemp = "AirTemp";
    export const RoadTemp = "RoadTemp";
    export const LocalAngularVelocity = "LocalAngularVelocity";
    export const FinalFF = "FinalFF";
    export const PerformanceMeter = "PerformanceMeter";
    export const EngineBrake = "EngineBrake";
    export const ErsRecoveryLevel = "ErsRecoveryLevel";
    export const ErsPowerLevel = "ErsPowerLevel";
    export const ErsHeatCharging = "ErsHeatCharging";
    export const ErsisCharging = "ErsisCharging";
    export const KersCurrentKJ = "KersCurrentKJ";
    export const DrsAvailable = "DrsAvailable";
    export const DrsEnabled = "DrsEnabled";
    export const BrakeTemp = "BrakeTemp";
    export const Clutch = "Clutch";
    export const TyreTempI = "TyreTempI";
    export const TyreTempM = "TyreTempM";
    export const TyreTempO = "TyreTempO";
    export const IsAIControlled = "IsAIControlled";
    export const TyreContactPoint = "TyreContactPoint";
    export const TyreContactNormal = "TyreContactNormal";
    export const TyreContactHeading = "TyreContactHeading";
    export const BrakeBias = "BrakeBias";
    export const LocalVelocity = "LocalVelocity";

    //Custom parameter code
    export const ManifoldPressure = "ManifoldPressure";
}

export namespace AssettoCorsaSHMGraphicsParameterCode
{
    export const Status = "Status";
    export const Session = "Session";
    export const CurrentTime = "CurrentTime";
    export const LastTime = "LastTime";
    export const BestTime = "BestTime";
    export const Split = "Split";
    export const CompletedLaps = "CompletedLaps";
    export const Position = "Position";
    export const iCurrentTime = "iCurrentTime";
    export const iLastTime = "iLastTime";
    export const iBestTime = "iBestTime";
    export const SessionTimeLeft = "SessionTimeLeft";
    export const DistanceTraveled = "DistanceTraveled";
    export const IsInPit = "IsInPit";
    export const CurrentSectorIndex = "CurrentSectorIndex";
    export const LastSectorTime = "LastSectorTime";
    export const NumberOfLaps = "NumberOfLaps";
    export const TyreCompound = "TyreCompound";
    export const ReplayTimeMultiplier = "ReplayTimeMultiplier";
    export const NormalizedCarPosition = "NormalizedCarPosition";
    export const CarCoordinates = "CarCoordinates";
    export const PenaltyTime = "PenaltyTime";
    export const Flag = "Flag";
    export const IdealLineOn = "IdealLineOn";
    export const IsInPitLane = "IsInPitLane";
    export const SurfaceGrip = "SurfaceGrip";
    export const MandatoryPitDone = "MandatoryPitDone";
}

export namespace AssettoCorsaSHMStaticInfoParameterCode
{
    export const SMVersion = "SMVersion";
    export const ACVersion = "ACVersion";
    export const NumberOfSessions = "NumberOfSessions";
    export const NumCars = "NumCars";
    export const CarModel = "CarModel";
    export const Track = "Track";
    export const PlayerName = "PlayerName";
    export const PlayerSurname = "PlayerSurname";
    export const PlayerNick = "PlayerNick";
    export const SectorCount = "SectorCount";
    export const MaxTorque = "MaxTorque";
    export const MaxPower = "MaxPower";
    export const MaxRpm = "MaxRpm";
    export const MaxFuel = "MaxFuel";
    export const SuspensionMaxTravel = "SuspensionMaxTravel";
    export const TyreRadius = "TyreRadius";
    export const MaxTurboBoost = "MaxTurboBoost";
    export const PenaltiesEnabled = "PenaltiesEnabled";
    export const AidFuelRate = "AidFuelRate";
    export const AidTireRate = "AidTireRate";
    export const AidMechanicalDamage = "AidMechanicalDamage";
    export const AidAllowTyreBlankets = "AidAllowTyreBlankets";
    export const AidStability = "AidStability";
    export const AidAutoClutch = "AidAutoClutch";
    export const AidAutoBlip = "AidAutoBlip";
    export const HasDRS = "HasDRS";
    export const HasERS = "HasERS";
    export const HasKERS = "HasKERS";
    export const KersMaxJoules = "KersMaxJoules";
    export const EngineBrakeSettingsCount = "EngineBrakeSettingsCount";
    export const ErsPowerControllerCount = "ErsPowerControllerCount";
    export const TrackSPlineLength = "TrackSPlineLength";
    export const TrackConfiguration = "TrackConfiguration";
    export const ErsMaxJ = "ErsMaxJ";
    export const IsTimedRace = "IsTimedRace";
    export const HasExtraLap = "HasExtraLap";
    export const CarSkin = "CarSkin";
    export const ReversedGridPositions = "ReversedGridPositions";
    export const PitWindowStart = "PitWindowStart";
    export const PitWindowEnd = "PitWindowEnd";
}

export namespace AssettoCorsaSHMStringVALCode
{
    export const Status = "Status";
    export const Session = "Session";
    export const CurrentTime = "CurrentTime";
    export const LastTime = "LastTime";
    export const BestTime = "BestTime";
    export const Split = "Split";
    
    export const TyreCompound = "TyreCompound";

    export const Flag = "Flag";

    export const SMVersion = "SMVersion";
    export const ACVersion = "ACVersion";

    export const CarModel = "CarModel";
    export const Track = "Track";
    export const PlayerName = "PlayerName";
    export const PlayerSurname = "PlayerSurname";
    export const PlayerNick = "PlayerNick";

    export const TrackConfiguration = "TrackConfiguration";

    export const CarSkin = "CarSkin";
}

export namespace AssettoCorsaSHMNumericalVALCode
{
    export const Gas = "Gas";
    export const Brake = "Brake";
    export const Fuel = "Fuel";
    export const Gear = "Gear";
    export const Rpms = "Rpms";
    export const SteerAngle = "SteerAngle";
    export const SpeedKmh = "SpeedKmh";
    export const Velocity = "Velocity";
    export const AccG = "AccG";
    export const WheelSlip = "WheelSlip";
    export const WheelLoad = "WheelLoad";
    export const WheelsPressure = "WheelsPressure";
    export const WheelAngularSpeed = "WheelAngularSpeed";
    export const TyreWear = "TyreWear";
    export const TyreDirtyLevel = "TyreDirtyLevel";
    export const TyreCoreTemperature = "TyreCoreTemperature";
    export const CamberRad = "CamberRad";
    export const SuspensionTravel = "SuspensionTravel";
    export const Drs = "Drs";
    export const TC = "TC";
    export const Heading = "Heading";
    export const Pitch = "Pitch";
    export const Roll = "Roll";
    export const CgHeight = "CgHeight";
    export const CarDamage = "CarDamage";
    export const NumberOfTyresOut = "NumberOfTyresOut";
    export const PitLimiterOn = "PitLimiterOn";
    export const Abs = "Abs";
    export const KersCharge = "KersCharge";
    export const KersInput = "KersInput";
    export const AutoShifterOn = "AutoShifterOn";
    export const RideHeight = "RideHeight";
    export const TurboBoost = "TurboBoost";
    export const Ballast = "Ballast";
    export const AirDensity = "AirDensity";
    export const AirTemp = "AirTemp";
    export const RoadTemp = "RoadTemp";
    export const LocalAngularVelocity = "LocalAngularVelocity";
    export const FinalFF = "FinalFF";
    export const PerformanceMeter = "PerformanceMeter";
    export const EngineBrake = "EngineBrake";
    export const ErsRecoveryLevel = "ErsRecoveryLevel";
    export const ErsPowerLevel = "ErsPowerLevel";
    export const ErsHeatCharging = "ErsHeatCharging";
    export const ErsisCharging = "ErsisCharging";
    export const KersCurrentKJ = "KersCurrentKJ";
    export const DrsAvailable = "DrsAvailable";
    export const DrsEnabled = "DrsEnabled";
    export const BrakeTemp = "BrakeTemp";
    export const Clutch = "Clutch";
    export const TyreTempI = "TyreTempI";
    export const TyreTempM = "TyreTempM";
    export const TyreTempO = "TyreTempO";
    export const IsAIControlled = "IsAIControlled";
    export const TyreContactPoint = "TyreContactPoint";
    export const TyreContactNormal = "TyreContactNormal";
    export const TyreContactHeading = "TyreContactHeading";
    export const BrakeBias = "BrakeBias";
    export const LocalVelocity = "LocalVelocity";

    //Custom parameter code
    export const ManifoldPressure = "ManifoldPressure";

    export const CompletedLaps = "CompletedLaps";
    export const Position = "Position";
    export const iCurrentTime = "iCurrentTime";
    export const iLastTime = "iLastTime";
    export const iBestTime = "iBestTime";
    export const SessionTimeLeft = "SessionTimeLeft";
    export const DistanceTraveled = "DistanceTraveled";
    export const IsInPit = "IsInPit";
    export const CurrentSectorIndex = "CurrentSectorIndex";
    export const LastSectorTime = "LastSectorTime";
    export const NumberOfLaps = "NumberOfLaps";
    export const ReplayTimeMultiplier = "ReplayTimeMultiplier";
    export const NormalizedCarPosition = "NormalizedCarPosition";
    export const CarCoordinates = "CarCoordinates";
    export const PenaltyTime = "PenaltyTime";

    export const IdealLineOn = "IdealLineOn";
    export const IsInPitLane = "IsInPitLane";
    export const SurfaceGrip = "SurfaceGrip";
    export const MandatoryPitDone = "MandatoryPitDone";

    export const NumberOfSessions = "NumberOfSessions";
    export const NumCars = "NumCars";

    export const SectorCount = "SectorCount";
    export const MaxTorque = "MaxTorque";
    export const MaxPower = "MaxPower";
    export const MaxRpm = "MaxRpm";
    export const MaxFuel = "MaxFuel";
    export const SuspensionMaxTravel = "SuspensionMaxTravel";
    export const TyreRadius = "TyreRadius";
    export const MaxTurboBoost = "MaxTurboBoost";
    export const PenaltiesEnabled = "PenaltiesEnabled";
    export const AidFuelRate = "AidFuelRate";
    export const AidTireRate = "AidTireRate";
    export const AidMechanicalDamage = "AidMechanicalDamage";
    export const AidAllowTyreBlankets = "AidAllowTyreBlankets";
    export const AidStability = "AidStability";
    export const AidAutoClutch = "AidAutoClutch";
    export const AidAutoBlip = "AidAutoBlip";
    export const HasDRS = "HasDRS";
    export const HasERS = "HasERS";
    export const HasKERS = "HasKERS";
    export const KersMaxJoules = "KersMaxJoules";
    export const EngineBrakeSettingsCount = "EngineBrakeSettingsCount";
    export const ErsPowerControllerCount = "ErsPowerControllerCount";
    export const TrackSPlineLength = "TrackSPlineLength";

    export const ErsMaxJ = "ErsMaxJ";
    export const IsTimedRace = "IsTimedRace";
    export const HasExtraLap = "HasExtraLap";

    export const ReversedGridPositions = "ReversedGridPositions";
    export const PitWindowStart = "PitWindowStart";
    export const PitWindowEnd = "PitWindowEnd";
}

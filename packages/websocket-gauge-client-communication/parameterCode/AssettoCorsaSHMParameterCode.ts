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

export const AssettoCorsaSHMPhysicsParameterCode =
    {
        Gas: "Gas",
        Brake: "Brake",
        Fuel: "Fuel",
        Gear: "Gear",
        Rpms: "Rpms",
        SteerAngle: "SteerAngle",
        SpeedKmh: "SpeedKmh",
        Velocity: "Velocity",
        AccG: "AccG",
        WheelSlip: "WheelSlip",
        WheelLoad: "WheelLoad",
        WheelsPressure: "WheelsPressure",
        WheelAngularSpeed: "WheelAngularSpeed",
        TyreWear: "TyreWear",
        TyreDirtyLevel: "TyreDirtyLevel",
        TyreCoreTemperature: "TyreCoreTemperature",
        CamberRad: "CamberRad",
        SuspensionTravel: "SuspensionTravel",
        Drs: "Drs",
        TC: "TC",
        Heading: "Heading",
        Pitch: "Pitch",
        Roll: "Roll",
        CgHeight: "CgHeight",
        CarDamage: "CarDamage",
        NumberOfTyresOut: "NumberOfTyresOut",
        PitLimiterOn: "PitLimiterOn",
        Abs: "Abs",
        KersCharge: "KersCharge",
        KersInput: "KersInput",
        AutoShifterOn: "AutoShifterOn",
        RideHeight: "RideHeight",
        TurboBoost: "TurboBoost",
        Ballast: "Ballast",
        AirDensity: "AirDensity",
        AirTemp: "AirTemp",
        RoadTemp: "RoadTemp",
        LocalAngularVelocity: "LocalAngularVelocity",
        FinalFF: "FinalFF",
        PerformanceMeter: "PerformanceMeter",
        EngineBrake: "EngineBrake",
        ErsRecoveryLevel: "ErsRecoveryLevel",
        ErsPowerLevel: "ErsPowerLevel",
        ErsHeatCharging: "ErsHeatCharging",
        ErsisCharging: "ErsisCharging",
        KersCurrentKJ: "KersCurrentKJ",
        DrsAvailable: "DrsAvailable",
        DrsEnabled: "DrsEnabled",
        BrakeTemp: "BrakeTemp",
        Clutch: "Clutch",
        TyreTempI: "TyreTempI",
        TyreTempM: "TyreTempM",
        TyreTempO: "TyreTempO",
        IsAIControlled: "IsAIControlled",
        TyreContactPoint: "TyreContactPoint",
        TyreContactNormal: "TyreContactNormal",
        TyreContactHeading: "TyreContactHeading",
        BrakeBias: "BrakeBias",
        LocalVelocity: "LocalVelocity",

        //Custom parameter code
        ManifoldPressure: "ManifoldPressure"
    } as const;

export type AssettoCorsaSHMPhysicsParameterCode = typeof AssettoCorsaSHMPhysicsParameterCode[keyof typeof AssettoCorsaSHMPhysicsParameterCode];

export const AssettoCorsaSHMGraphicsParameterCode =
    {
        Status: "Status",
        Session: "Session",
        CurrentTime: "CurrentTime",
        LastTime: "LastTime",
        BestTime: "BestTime",
        Split: "Split",
        CompletedLaps: "CompletedLaps",
        Position: "Position",
        iCurrentTime: "iCurrentTime",
        iLastTime: "iLastTime",
        iBestTime: "iBestTime",
        SessionTimeLeft: "SessionTimeLeft",
        DistanceTraveled: "DistanceTraveled",
        IsInPit: "IsInPit",
        CurrentSectorIndex: "CurrentSectorIndex",
        LastSectorTime: "LastSectorTime",
        NumberOfLaps: "NumberOfLaps",
        TyreCompound: "TyreCompound",
        ReplayTimeMultiplier: "ReplayTimeMultiplier",
        NormalizedCarPosition: "NormalizedCarPosition",
        CarCoordinates: "CarCoordinates",
        PenaltyTime: "PenaltyTime",
        Flag: "Flag",
        IdealLineOn: "IdealLineOn",
        IsInPitLane: "IsInPitLane",
        SurfaceGrip: "SurfaceGrip",
        MandatoryPitDone: "MandatoryPitDone"

    } as const;

export type AssettoCorsaSHMGraphicsParameterCode = typeof AssettoCorsaSHMGraphicsParameterCode[keyof typeof AssettoCorsaSHMGraphicsParameterCode];

export const AssettoCorsaSHMStaticInfoParameterCode =
    {
        SMVersion: "SMVersion",
        ACVersion: "ACVersion",
        NumberOfSessions: "NumberOfSessions",
        NumCars: "NumCars",
        CarModel: "CarModel",
        Track: "Track",
        PlayerName: "PlayerName",
        PlayerSurname: "PlayerSurname",
        PlayerNick: "PlayerNick",
        SectorCount: "SectorCount",
        MaxTorque: "MaxTorque",
        MaxPower: "MaxPower",
        MaxRpm: "MaxRpm",
        MaxFuel: "MaxFuel",
        SuspensionMaxTravel: "SuspensionMaxTravel",
        TyreRadius: "TyreRadius",
        MaxTurboBoost: "MaxTurboBoost",
        PenaltiesEnabled: "PenaltiesEnabled",
        AidFuelRate: "AidFuelRate",
        AidTireRate: "AidTireRate",
        AidMechanicalDamage: "AidMechanicalDamage",
        AidAllowTyreBlankets: "AidAllowTyreBlankets",
        AidStability: "AidStability",
        AidAutoClutch: "AidAutoClutch",
        AidAutoBlip: "AidAutoBlip",
        HasDRS: "HasDRS",
        HasERS: "HasERS",
        HasKERS: "HasKERS",
        KersMaxJoules: "KersMaxJoules",
        EngineBrakeSettingsCount: "EngineBrakeSettingsCount",
        ErsPowerControllerCount: "ErsPowerControllerCount",
        TrackSPlineLength: "TrackSPlineLength",
        TrackConfiguration: "TrackConfiguration",
        ErsMaxJ: "ErsMaxJ",
        IsTimedRace: "IsTimedRace",
        HasExtraLap: "HasExtraLap",
        CarSkin: "CarSkin",
        ReversedGridPositions: "ReversedGridPositions",
        PitWindowStart: "PitWindowStart",
        PitWindowEnd: "PitWindowEnd"
    } as const;

export type AssettoCorsaSHMStaticInfoParameterCode = typeof AssettoCorsaSHMStaticInfoParameterCode[keyof typeof AssettoCorsaSHMStaticInfoParameterCode];

export const AssettoCorsaSHMStringVALCode =
    {
        Status: "Status",
        Session: "Session",
        CurrentTime: "CurrentTime",
        LastTime: "LastTime",
        BestTime: "BestTime",
        Split: "Split",

        TyreCompound: "TyreCompound",

        Flag: "Flag",

        SMVersion: "SMVersion",
        ACVersion: "ACVersion",

        CarModel: "CarModel",
        Track: "Track",
        PlayerName: "PlayerName",
        PlayerSurname: "PlayerSurname",
        PlayerNick: "PlayerNick",

        TrackConfiguration: "TrackConfiguration",

        CarSkin: "CarSkin"

    } as const;

export type AssettoCorsaSHMStringVALCode = typeof AssettoCorsaSHMStringVALCode[keyof typeof AssettoCorsaSHMStringVALCode];

export const AssettoCorsaSHMNumericalVALCode =
    {
        Gas: "Gas",
        Brake: "Brake",
        Fuel: "Fuel",
        Gear: "Gear",
        Rpms: "Rpms",
        SteerAngle: "SteerAngle",
        SpeedKmh: "SpeedKmh",
        Velocity_00: "Velocity_00",
        Velocity_01: "Velocity_01",
        Velocity_02: "Velocity_02",
        AccG_00: "AccG_00",
        AccG_01: "AccG_01",
        AccG_02: "AccG_02",
        WheelSlip_00: "WheelSlip_00",
        WheelSlip_01: "WheelSlip_01",
        WheelSlip_02: "WheelSlip_02",
        WheelSlip_03: "WheelSlip_03",
        WheelLoad_00: "WheelLoad_00",
        WheelLoad_01: "WheelLoad_01",
        WheelLoad_02: "WheelLoad_02",
        WheelLoad_03: "WheelLoad_03",
        WheelsPressure_00: "WheelsPressure_00",
        WheelsPressure_01: "WheelsPressure_01",
        WheelsPressure_02: "WheelsPressure_02",
        WheelsPressure_03: "WheelsPressure_03",
        WheelAngularSpeed_00: "WheelAngularSpeed_00",
        WheelAngularSpeed_01: "WheelAngularSpeed_01",
        WheelAngularSpeed_02: "WheelAngularSpeed_02",
        WheelAngularSpeed_03: "WheelAngularSpeed_03",
        TyreWear_00: "TyreWear_00",
        TyreWear_01: "TyreWear_01",
        TyreWear_02: "TyreWear_02",
        TyreWear_03: "TyreWear_03",
        TyreDirtyLevel_00: "TyreDirtyLevel_00",
        TyreDirtyLevel_01: "TyreDirtyLevel_01",
        TyreDirtyLevel_02: "TyreDirtyLevel_02",
        TyreDirtyLevel_03: "TyreDirtyLevel_03",
        TyreCoreTemperature_00: "TyreCoreTemperature_00",
        TyreCoreTemperature_01: "TyreCoreTemperature_01",
        TyreCoreTemperature_02: "TyreCoreTemperature_02",
        TyreCoreTemperature_03: "TyreCoreTemperature_03",
        CamberRad_00: "CamberRad_00",
        CamberRad_01: "CamberRad_01",
        CamberRad_02: "CamberRad_02",
        CamberRad_03: "CamberRad_03",
        SuspensionTravel_00: "SuspensionTravel_00",
        SuspensionTravel_01: "SuspensionTravel_01",
        SuspensionTravel_02: "SuspensionTravel_02",
        SuspensionTravel_03: "SuspensionTravel_03",
        Drs: "Drs",
        TC: "TC",
        Heading: "Heading",
        Pitch: "Pitch",
        Roll: "Roll",
        CgHeight: "CgHeight",
        CarDamage_00: "CarDamage_00",
        CarDamage_01: "CarDamage_01",
        CarDamage_02: "CarDamage_02",
        CarDamage_03: "CarDamage_03",
        CarDamage_04: "CarDamage_04",
        NumberOfTyresOut: "NumberOfTyresOut",
        PitLimiterOn: "PitLimiterOn",
        Abs: "Abs",
        KersCharge: "KersCharge",
        KersInput: "KersInput",
        AutoShifterOn: "AutoShifterOn",
        RideHeight_00: "RideHeight_00",
        RideHeight_01: "RideHeight_01",
        TurboBoost: "TurboBoost",
        Ballast: "Ballast",
        AirDensity: "AirDensity",
        AirTemp: "AirTemp",
        RoadTemp: "RoadTemp",
        LocalAngularVelocity_00: "LocalAngularVelocity_00",
        LocalAngularVelocity_01: "LocalAngularVelocity_01",
        LocalAngularVelocity_02: "LocalAngularVelocity_02",
        FinalFF: "FinalFF",
        PerformanceMeter: "PerformanceMeter",
        EngineBrake: "EngineBrake",
        ErsRecoveryLevel: "ErsRecoveryLevel",
        ErsPowerLevel: "ErsPowerLevel",
        ErsHeatCharging: "ErsHeatCharging",
        ErsisCharging: "ErsisCharging",
        KersCurrentKJ: "KersCurrentKJ",
        DrsAvailable: "DrsAvailable",
        DrsEnabled: "DrsEnabled",
        BrakeTemp_00: "BrakeTemp_00",
        BrakeTemp_01: "BrakeTemp_01",
        BrakeTemp_02: "BrakeTemp_02",
        BrakeTemp_03: "BrakeTemp_03",
        Clutch: "Clutch",
        TyreTempI_00: "TyreTempI_00",
        TyreTempI_01: "TyreTempI_01",
        TyreTempI_02: "TyreTempI_02",
        TyreTempI_03: "TyreTempI_03",
        TyreTempM_00: "TyreTempM_00",
        TyreTempM_01: "TyreTempM_01",
        TyreTempM_02: "TyreTempM_02",
        TyreTempM_03: "TyreTempM_03",
        TyreTempO_00: "TyreTempO_00",
        TyreTempO_01: "TyreTempO_01",
        TyreTempO_02: "TyreTempO_02",
        TyreTempO_03: "TyreTempO_03",
        IsAIControlled: "IsAIControlled",
        TyreContactPoint_00_X: "TyreContactPoint_00_X",
        TyreContactPoint_00_Y: "TyreContactPoint_00_Y",
        TyreContactPoint_00_Z: "TyreContactPoint_00_Z",
        TyreContactPoint_01_X: "TyreContactPoint_01_X",
        TyreContactPoint_01_Y: "TyreContactPoint_01_Y",
        TyreContactPoint_01_Z: "TyreContactPoint_01_Z",
        TyreContactPoint_02_X: "TyreContactPoint_02_X",
        TyreContactPoint_02_Y: "TyreContactPoint_02_Y",
        TyreContactPoint_02_Z: "TyreContactPoint_02_Z",
        TyreContactPoint_03_X: "TyreContactPoint_03_X",
        TyreContactPoint_03_Y: "TyreContactPoint_03_Y",
        TyreContactPoint_03_Z: "TyreContactPoint_03_Z",
        TyreContactNormal_00_X: "TyreContactNormal_00_X",
        TyreContactNormal_00_Y: "TyreContactNormal_00_Y",
        TyreContactNormal_00_Z: "TyreContactNormal_00_Z",
        TyreContactNormal_01_X: "TyreContactNormal_01_X",
        TyreContactNormal_01_Y: "TyreContactNormal_01_Y",
        TyreContactNormal_01_Z: "TyreContactNormal_01_Z",
        TyreContactNormal_02_X: "TyreContactNormal_02_X",
        TyreContactNormal_02_Y: "TyreContactNormal_02_Y",
        TyreContactNormal_02_Z: "TyreContactNormal_02_Z",
        TyreContactNormal_03_X: "TyreContactNormal_03_X",
        TyreContactNormal_03_Y: "TyreContactNormal_03_Y",
        TyreContactNormal_03_Z: "TyreContactNormal_03_Z",
        TyreContactHeading_00_X: "TyreContactHeading_00_X",
        TyreContactHeading_00_Y: "TyreContactHeading_00_Y",
        TyreContactHeading_00_Z: "TyreContactHeading_00_Z",
        TyreContactHeading_01_X: "TyreContactHeading_01_X",
        TyreContactHeading_01_Y: "TyreContactHeading_01_Y",
        TyreContactHeading_01_Z: "TyreContactHeading_01_Z",
        TyreContactHeading_02_X: "TyreContactHeading_02_X",
        TyreContactHeading_02_Y: "TyreContactHeading_02_Y",
        TyreContactHeading_02_Z: "TyreContactHeading_02_Z",
        TyreContactHeading_03_X: "TyreContactHeading_03_X",
        TyreContactHeading_03_Y: "TyreContactHeading_03_Y",
        TyreContactHeading_03_Z: "TyreContactHeading_03_Z",
        BrakeBias: "BrakeBias",
        LocalVelocity_00: "LocalVelocity_00",
        LocalVelocity_01: "LocalVelocity_01",
        LocalVelocity_02: "LocalVelocity_02",

        //Custom parameter code
        ManifoldPressure: "ManifoldPressure",

        CompletedLaps: "CompletedLaps",
        Position: "Position",
        iCurrentTime: "iCurrentTime",
        iLastTime: "iLastTime",
        iBestTime: "iBestTime",
        SessionTimeLeft: "SessionTimeLeft",
        DistanceTraveled: "DistanceTraveled",
        IsInPit: "IsInPit",
        CurrentSectorIndex: "CurrentSectorIndex",
        LastSectorTime: "LastSectorTime",
        NumberOfLaps: "NumberOfLaps",
        ReplayTimeMultiplier: "ReplayTimeMultiplier",
        NormalizedCarPosition: "NormalizedCarPosition",
        CarCoordinates_00: "CarCoordinates_00",
        CarCoordinates_01: "CarCoordinates_01",
        CarCoordinates_02: "CarCoordinates_02",
        PenaltyTime: "PenaltyTime",

        IdealLineOn: "IdealLineOn",
        IsInPitLane: "IsInPitLane",
        SurfaceGrip: "SurfaceGrip",
        MandatoryPitDone: "MandatoryPitDone",

        NumberOfSessions: "NumberOfSessions",
        NumCars: "NumCars",

        SectorCount: "SectorCount",
        MaxTorque: "MaxTorque",
        MaxPower: "MaxPower",
        MaxRpm: "MaxRpm",
        MaxFuel: "MaxFuel",
        SuspensionMaxTravel_00: "SuspensionMaxTravel_00",
        SuspensionMaxTravel_01: "SuspensionMaxTravel_01",
        SuspensionMaxTravel_02: "SuspensionMaxTravel_02",
        SuspensionMaxTravel_03: "SuspensionMaxTravel_03",
        TyreRadius_00: "TyreRadius_00",
        TyreRadius_01: "TyreRadius_01",
        TyreRadius_02: "TyreRadius_02",
        TyreRadius_03: "TyreRadius_03",
        MaxTurboBoost: "MaxTurboBoost",
        PenaltiesEnabled: "PenaltiesEnabled",
        AidFuelRate: "AidFuelRate",
        AidTireRate: "AidTireRate",
        AidMechanicalDamage: "AidMechanicalDamage",
        AidAllowTyreBlankets: "AidAllowTyreBlankets",
        AidStability: "AidStability",
        AidAutoClutch: "AidAutoClutch",
        AidAutoBlip: "AidAutoBlip",
        HasDRS: "HasDRS",
        HasERS: "HasERS",
        HasKERS: "HasKERS",
        KersMaxJoules: "KersMaxJoules",
        EngineBrakeSettingsCount: "EngineBrakeSettingsCount",
        ErsPowerControllerCount: "ErsPowerControllerCount",
        TrackSPlineLength: "TrackSPlineLength",

        ErsMaxJ: "ErsMaxJ",
        IsTimedRace: "IsTimedRace",
        HasExtraLap: "HasExtraLap",

        ReversedGridPositions: "ReversedGridPositions",
        PitWindowStart: "PitWindowStart",
        PitWindowEnd: "PitWindowEnd"
    } as const;

export type AssettoCorsaSHMNumericalVALCode = typeof AssettoCorsaSHMNumericalVALCode[keyof typeof AssettoCorsaSHMNumericalVALCode];

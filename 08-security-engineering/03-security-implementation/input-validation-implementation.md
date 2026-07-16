# Input Validation

## 1. Backend Application Context
Input Validation verifies that incoming API requests conform to schema formats and data constraints.

## 2. Backend-Specific Pitfalls
- **Validating without size checks:** Allowing strings to exceed maximum length limits, causing CPU exhaustion during regex checks.

## 3. Code-Shape Example
`	ypescript
// Enforce string length validation in input DTO
import { IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Length(2, 50)
  displayName: string;

  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;
}
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Security](../security-fundamentals-policy.md)

import { type CardProps } from "@mui/material/Card";
import React from "react";
/** @alpha */
export type BaseCardLoadingProps = CardProps;
/**
 * Skeleton loading state for BaseCard.
 *
 * @alpha
 */
export declare const BaseCardLoading: React.ForwardRefExoticComponent<Omit<CardProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

import { Component, type ErrorInfo } from 'react';

import MFEUnavailable from '../MFEUnavailable/MFEUnavailable';

import type { MFEErrorBoundaryProps, MFEErrorBoundaryState } from './MFEErrorBoundary.types';

class MFEErrorBoundary extends Component<MFEErrorBoundaryProps, MFEErrorBoundaryState> {
  constructor(props: MFEErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): MFEErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[MFEErrorBoundary] "${this.props.name}" failed to load:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <MFEUnavailable
            name={this.props.name}
            onRetry={() => this.setState({ hasError: false, error: null })}
          />
        )
      );
    }
    return this.props.children;
  }
}

export default MFEErrorBoundary;

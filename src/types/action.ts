/**
 * Options for all actions
 */
export interface ActionOptions {
  timeout?: number;
  tab_id?: number;
}

/**
 * Result returned from browser actions
 */
export interface ActionResult {
  success: boolean;
  element?: string;
  error?: string;
}

/**
 * DOM tree node structure matching the user's example
 */
export interface DOMNode {
  id?: number;
  type: string;
  text?: string;
  content?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  href?: string;
  active?: boolean;
  primary?: boolean;
  icon?: string;
  children?: DOMNode[];
}

/**
 * Page structure with metadata
 */
export interface PageStructure {
  page: string;
  url: string;
  tree: DOMNode;
}

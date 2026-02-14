import { Components } from "react-markdown";

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1
      style={{
        fontFamily: "SBAggroM",
        fontSize: "24px",
        marginBottom: "16px",
        marginTop: "24px",
        color: "#A3FF0C",
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      style={{
        fontFamily: "SBAggroM",
        fontSize: "18px",
        marginBottom: "12px",
        marginTop: "20px",
        color: "#E5E5E9",
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontFamily: "SUIT-BODY",
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "8px",
        marginTop: "16px",
        color: "#E5E5E9",
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p
      style={{
        marginBottom: "12px",
        color: "#C0C0C5",
      }}
    >
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul
      style={{
        marginBottom: "12px",
        paddingLeft: "20px",
        listStyleType: "disc",
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        marginBottom: "12px",
        paddingLeft: "20px",
        listStyleType: "decimal",
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li
      style={{
        marginBottom: "8px",
        color: "#C0C0C5",
      }}
    >
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong
      style={{
        fontWeight: "bold",
        color: "#E5E5E9",
      }}
    >
      {children}
    </strong>
  ),
  table: ({ children }) => (
    <table
      style={{
        width: "100%",
        marginBottom: "16px",
        borderCollapse: "collapse",
      }}
    >
      {children}
    </table>
  ),
  thead: ({ children }) => (
    <thead
      style={{
        backgroundColor: "#444447",
      }}
    >
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th
      style={{
        padding: "8px",
        border: "1px solid #666669",
        textAlign: "left",
        fontWeight: "bold",
        color: "#E5E5E9",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      style={{
        padding: "8px",
        border: "1px solid #666669",
        color: "#C0C0C5",
      }}
    >
      {children}
    </td>
  ),
  hr: () => (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #444447",
        margin: "16px 0",
      }}
    />
  ),
};

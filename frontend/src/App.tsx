import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentDetailPage from "./pages/DocumentDetailPage";
import ChatPage from "./pages/ChatPage";
import AddDocumentPage from "./pages/AddDocumentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/documentos" element={<DocumentsPage />} />
          <Route path="/documentos/:id" element={<DocumentDetailPage />} />
          <Route path="/documentos/novo" element={<AddDocumentPage />} />
          <Route path="/pergunte" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

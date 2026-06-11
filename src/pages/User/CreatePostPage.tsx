// src/pages/User/CreatePostPage.tsx
import CreatePostForm from '../../features/User/F16_Post/components/CreatePostForm';
import { Card } from '../../components/ui/card';

export default function CreatePostPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Buat Pertanyaan Baru</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ajukan pertanyaan kamu ke komunitas. Pastikan judul jelas dan detail cukup.
        </p>
      </div>
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <div className="p-6">
          <CreatePostForm />
        </div>
      </Card>
    </div>
  );
}

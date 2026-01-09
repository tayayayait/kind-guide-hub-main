import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { User, Settings, Heart, FileText } from "lucide-react";
import { useCompare } from "@/state/compare";

export default function MyPage() {
    const { items, remove } = useCompare();
    const navigate = useNavigate();

    return (
        <PageLayout title="마이 페이지">
            <div className="px-6 py-8">
                {/* User Profile Stub */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">게스트 님</h2>
                        <p className="text-sm text-muted-foreground">로그인이 필요합니다</p>
                    </div>
                </div>

                {/* Saved Items Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-primary" />
                        관심 장례식장 ({items.length})
                    </h3>

                    {items.length === 0 ? (
                        <div className="text-center py-6 bg-muted/30 rounded-xl border border-dashed border-border">
                            <p className="text-sm text-muted-foreground">찜한 장례식장이 없습니다.</p>
                            <Button
                                variant="link"
                                className="text-primary h-auto p-0 mt-2"
                                onClick={() => navigate("/")}
                            >
                                장례식장 찾아보기
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center p-3 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/detail/${item.id}`, { state: { service: item } })}
                                >
                                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs mr-3 flex-shrink-0">
                                        🏥
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold truncate text-sm">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{item.location}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            remove(item.id);
                                        }}
                                    >
                                        <span className="sr-only">삭제</span>
                                        <Heart className="w-4 h-4 fill-current" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Other Menu Items */}
                <div className="space-y-2">
                    <button className="w-full flex items-center p-4 bg-card border border-border rounded-xl hover:bg-accent/5 transition-colors">
                        <FileText className="w-5 h-5 mr-3 text-muted-foreground" />
                        <span className="font-medium flex-1 text-left">나의 견적 내역</span>
                    </button>

                    <button className="w-full flex items-center p-4 bg-card border border-border rounded-xl hover:bg-accent/5 transition-colors">
                        <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
                        <span className="font-medium flex-1 text-left">설정</span>
                    </button>
                </div>

                <div className="mt-8">
                    <Button className="w-full bg-muted text-muted-foreground hover:bg-muted/80">
                        로그인 / 회원가입
                    </Button>
                </div>
            </div>
        </PageLayout>
    );
}

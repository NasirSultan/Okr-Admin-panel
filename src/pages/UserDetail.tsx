import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Award, Trophy, TrendingUp, Zap, Users as UsersIcon, Target, Flame } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getUserProfile } from '../api/userManagement';
import { Button } from '@/components/ui/button';

function UserDetail() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);




const fetchUserDetail = async () => {
    try {
        setLoading(true);
        setError(null);

        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/users');
            return;
        }

        const CACHE_KEY = `userProfileCache_${userId}`;
        const CACHE_EXPIRY = 5 * 60 * 1000;

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
                setProfile(parsed.data);
                setLoading(false);
                return;
            }
        }

        const response = await getUserProfile(userId);
        if (response.success && response.data?.data) {
            setProfile(response.data.data);
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ data: response.data.data, timestamp: Date.now() })
            );
        } else if (response.data) {
            setProfile(response.data);
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ data: response.data, timestamp: Date.now() })
            );
        } else {
            setError('Invalid response structure');
        }
    } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load user details');
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        fetchUserDetail();
    }, []);

    const user = profile?.user || {};
    const xp = profile?.xp || {};
    const ranking = profile?.ranking || {};
    const certificates = profile?.certificates ?? 0;
    const meta = profile?.meta || {};

    const { name, email, lastActiveAt, isBlocked } = user;
    const { total: totalXP, level, title } = xp;
    const { globalRank, totalUsers } = ranking;
    const { soloXp, teamXp, challengeXp, bonusXp } = meta;

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    return (
        <AdminLayout>
            <div className="p-2 sm:p-4 space-y-4 max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center p-10">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-gray-600 text-sm">Loading user details...</p>
                        </div>
                    </div>
                ) : error || !profile ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-600 font-medium text-base">{error || 'User not found'}</p>
                        <Button variant="outline" onClick={() => navigate('/users')} className="mt-2 text-sm px-3 py-1">
                            &larr; Back to Users
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                                    {getInitials(name)}
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{name || 'Unknown User'}</h2>
                                    <p className="text-gray-500 flex items-center gap-1 text-sm mt-0.5">
                                        <Mail className="w-3.5 h-3.5" />
                                        {email || 'No email'}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" onClick={() => navigate('/users')} className="text-sm px-3 py-1">
                                &larr; Back
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-200 flex flex-col h-full">
                                <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> Profile Information
                                </h3>
                                <div className="space-y-1 sm:space-y-2 flex-1">
                                    <div className="flex items-start justify-between py-2 sm:py-3 border-b border-gray-100">
                                        <div className="flex-1">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Name</p>
                                            <p className="font-semibold text-gray-800 text-sm sm:text-base">{name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between py-2 sm:py-3 border-b border-gray-100">
                                        <div className="flex-1">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Last Active</p>
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">{formatDate(lastActiveAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between py-2 sm:py-3">
                                        <div className="flex-1">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1">Account Status</p>
                                            <span
                                                className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {isBlocked ? 'Suspended' : 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-3 sm:p-6 shadow border border-gray-200 flex flex-col h-full">
                                <h3 className="font-semibold text-base sm:text-xl text-gray-800 mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> Progress & Stats
                                </h3>
                                <div className="flex-1 flex flex-col">
                                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6 text-white">
                                        <div className="flex flex-row items-center justify-between gap-1">
                                            <div>
                                                <p className="text-red-100 text-xs sm:text-sm mb-0.5">Current Title</p>
                                                <p className="text-base sm:text-2xl font-bold flex items-center gap-1 sm:gap-2">
                                                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    {title || 'Newcomer'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-red-100 text-xs sm:text-sm mb-0.5">Level</p>
                                                <p className="text-xl sm:text-3xl font-bold">{level ?? 1}</p>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                        <div className="bg-red-50 rounded-lg p-2 sm:p-4 border border-red-100">
                                            <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                                <p className="text-xs sm:text-sm text-gray-600 font-medium">Total XP</p>
                                            </div>
                                            <p className="text-base sm:text-2xl font-bold text-gray-800">{totalXP ?? 0}</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-2 sm:p-4 border border-blue-100">
                                            <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                                <p className="text-xs sm:text-sm text-gray-600 font-medium">Certificates</p>
                                            </div>
                                            <p className="text-base sm:text-2xl font-bold text-gray-800">{certificates}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className="bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-red-100 flex items-center justify-center">
                                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500">Global Rank</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{globalRank ?? 'Unranked'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500">Out of</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{totalUsers ?? 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 sm:p-6 shadow border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            <div className="border-l-4 border-red-500 pl-3 py-2 sm:pl-4 sm:py-3 bg-red-50 rounded-r">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Solo XP</p>
                                </div>
                                <p className="text-lg sm:text-2xl font-bold text-gray-800">{soloXp ?? 0}</p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-3 py-2 sm:pl-4 sm:py-3 bg-blue-50 rounded-r">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <UsersIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Team XP</p>
                                </div>
                                <p className="text-lg sm:text-2xl font-bold text-gray-800">{teamXp ?? 0}</p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-3 py-2 sm:pl-4 sm:py-3 bg-purple-50 rounded-r">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Challenge XP</p>
                                </div>
                                <p className="text-lg sm:text-2xl font-bold text-gray-800">{challengeXp ?? 0}</p>
                            </div>
                            <div className="border-l-4 border-amber-500 pl-3 py-2 sm:pl-4 sm:py-3 bg-amber-50 rounded-r">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Bonus XP</p>
                                </div>
                                <p className="text-lg sm:text-2xl font-bold text-gray-800">{bonusXp ?? 0}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

export default UserDetail;

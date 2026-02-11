import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { ConnectionLevel, DailyRituals } from '../components/ConnectionLevel';
import { Calendar, MapPin, Heart } from 'lucide-react';

export function DashboardConnected({ connectedUser, onBreak }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Connection Level & Daily Rituals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConnectionLevel />
        <DailyRituals />
      </div>

      {/* Connected User Card */}
      <Card glow>
        <div className="text-center space-y-6 py-6">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/10 border border-accent-purple/20"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-4xl">💝</span>
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gradient-purple">Connected</h2>
            <p className="text-text-secondary">Your exclusive connection</p>
          </div>
          
          {/* User Profile */}
          <div className="space-y-4">
            {connectedUser?.profilePicture ? (
              <img 
                src={connectedUser.profilePicture} 
                alt={connectedUser.displayName}
                className="w-20 h-20 mx-auto rounded-3xl object-cover shadow-glow-subtle"
              />
            ) : (
              <Avatar name={connectedUser?.displayName} size="xl" />
            )}
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{connectedUser?.displayName}</h3>
              <p className="text-text-tertiary">@{connectedUser?.username}</p>
            </div>
            
            {connectedUser?.bio && (
              <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
                {connectedUser.bio}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {connectedUser?.age && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-subtle border border-border text-xs text-text-tertiary">
                  <Calendar className="w-3.5 h-3.5" />
                  {connectedUser.age} years old
                </div>
              )}
              {connectedUser?.location?.city && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-subtle border border-border text-xs text-text-tertiary">
                  <MapPin className="w-3.5 h-3.5" />
                  {connectedUser.location.city}{connectedUser.location.country && `, ${connectedUser.location.country}`}
                </div>
              )}
            </div>

            {connectedUser?.interests && connectedUser.interests.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-text-quaternary font-medium flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  Interests
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {connectedUser.interests.map((interest, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              icon={<MessageCircle className="w-5 h-5" strokeWidth={2} />}
              size="lg"
              onClick={() => navigate('/chat')}
            >
              Open Chat
            </Button>
            <Button 
              variant="ghost" 
              size="md"
              onClick={onBreak}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              End Connection (Lose All Progress)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
class ChangeTasksDefaultCompleted < ActiveRecord::Migration
  def change
  	change_column_default :tasks, :completed, from: nil, to: false
  end
end
